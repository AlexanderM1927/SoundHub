import { Innertube } from 'youtubei.js'
import { PassThrough, Readable } from 'node:stream'
// @ts-ignore
import youtubesearchapi from 'youtube-search-api'

let innertubeInstance: Innertube | null = null
let innertubeCreatedAt: number = 0
const INNERTUBE_TTL_MS = 30 * 60 * 1000 // 30 minutes
const RESOLUTION_CACHE_TTL_MS = 5 * 60 * 1000
const VIDEO_INFO_CLIENTS = ['ANDROID', 'WEB', 'IOS', 'WEB_EMBEDDED', 'TV_EMBEDDED'] as const
const YOUTUBE_SERVICE_URL = process.env.YOUTUBE_SERVICE_URL?.trim().replace(/\/$/, '') || ''
const videoResolutionCache = new Map<string, any>()

async function getInnertube (): Promise<Innertube> {
    const now = Date.now()
    if (!innertubeInstance || (now - innertubeCreatedAt) > INNERTUBE_TTL_MS) {
        // Keep the JS player available so formats that need deciphering can be resolved.
        innertubeInstance = await Innertube.create({
            client_type: 'ANDROID' as any,
            retrieve_player: true
        })
        innertubeCreatedAt = now
    }
    return innertubeInstance
}

async function getVideoInfoWithFallback (videoId: string) {
    const yt = await getInnertube()
    let lastError: unknown = null
    let lastInfo: Awaited<ReturnType<typeof yt.getBasicInfo>> | null = null

    for (const client of VIDEO_INFO_CLIENTS) {
        try {
            const info = await yt.getBasicInfo(videoId, {
                client: client as any
            })
            lastInfo = info

            if (info.streaming_data?.formats?.length || info.streaming_data?.adaptive_formats?.length) {
                return { yt, info, client }
            }
        } catch (error) {
            lastError = error
        }
    }

    if (lastInfo) {
        return { yt, info: lastInfo, client: 'ANDROID' as const }
    }

    throw lastError ?? new Error('Streaming data not available')
}

function getRemoteServiceUrl (pathname: string) {
    if (!YOUTUBE_SERVICE_URL) return null
    return `${YOUTUBE_SERVICE_URL}${pathname.startsWith('/') ? pathname : `/${pathname}`}`
}

async function getRemoteVideoInfo (url: string) {
    const remoteUrl = getRemoteServiceUrl(`/info/${encodeURIComponent(url)}`)
    if (!remoteUrl) return null

    const response = await fetch(remoteUrl)
    if (!response.ok) {
        throw new Error(`Remote youtube service failed: ${response.status} ${response.statusText}`)
    }

    return await response.json()
}

async function downloadRemoteVideo (url: string, options: any) {
    const remotePath = getRemoteServiceUrl(`/download/video/${encodeURIComponent(url)}`)
    if (!remotePath) return null

    const remoteUrl = new URL(remotePath)
    if (options?.quality) {
        remoteUrl.searchParams.set('quality', String(options.quality))
    }

    const headers: Record<string, string> = {
        'User-Agent': 'SoundHub/1.0'
    }

    if (options?.range) {
        headers.Range = `bytes=${options.range.start}-${options.range.end}`
    }

    const response = await fetch(remoteUrl, { headers })
    if (!response.ok) {
        throw new Error(`Remote youtube service failed: ${response.status} ${response.statusText}`)
    }

    if (!response.body) {
        throw new Error('Remote youtube service returned an empty body')
    }

    return Readable.fromWeb(response.body as any)
}

function extractVideoId (urlOrId: string): string {
    try {
        const parsed = new URL(urlOrId)
        return parsed.searchParams.get('v') ?? urlOrId
    } catch {
        return urlOrId
    }
}

function getResolutionCacheKey (urlOrId: string, quality: any) {
    return `${extractVideoId(urlOrId)}:${quality ?? 'best'}`
}

function getCachedResolution (urlOrId: string, quality: any) {
    const key = getResolutionCacheKey(urlOrId, quality)
    const cached = videoResolutionCache.get(key)
    if (!cached) return null

    if ((Date.now() - cached.cachedAt) > RESOLUTION_CACHE_TTL_MS) {
        videoResolutionCache.delete(key)
        return null
    }

    return cached
}

function setCachedResolution (urlOrId: string, quality: any, resolution: any) {
    const key = getResolutionCacheKey(urlOrId, quality)
    videoResolutionCache.set(key, {
        ...resolution,
        cachedAt: Date.now()
    })
}

async function resolveVideoPlayback (url: string, options: any = {}) {
    const cached = getCachedResolution(url, options?.quality)
    if (cached) return cached

    const { yt, info } = await getVideoInfoWithFallback(extractVideoId(url))

    if (!info.streaming_data?.formats?.length && !info.streaming_data?.adaptive_formats?.length) {
        const reason = info.playability_status?.reason || info.playability_status?.status || 'unknown'
        throw new Error(`Streaming data not available (${reason})`)
    }

    const format = info.chooseFormat({
        itag: options?.quality,
        type: 'video+audio',
        format: 'mp4'
    })

    const resolvedUrl = (await format.decipher(yt.session.player)) || format.url

    if (!resolvedUrl) {
        const reason = info.playability_status?.reason || info.playability_status?.status || 'unknown'
        throw new Error(`No suitable format found (${reason})`)
    }

    const container = format?.mime_type.split('/')[1]?.split(';')[0]?.trim() ?? 'mp4'

    let contentLength = format?.content_length
    if (!contentLength && resolvedUrl) {
        try {
            const head = await fetch(resolvedUrl, {
                method: 'HEAD',
                headers: { 'User-Agent': 'com.google.android.youtube/17.36.4 (Linux; U; Android 12) gzip' }
            })
            const cl = head.headers.get('content-length')
            if (cl) contentLength = parseInt(cl, 10)
        } catch {
            // non-fatal: if HEAD fails, the stream can still start without range support
        }
    }

    const resolution = {
        contentLength,
        container,
        resolvedUrl,
        itag: format?.itag,
        relatedVideos: []
    }

    setCachedResolution(url, options?.quality, resolution)
    if (resolution.itag !== options?.quality) {
        setCachedResolution(url, resolution.itag, resolution)
    }
    return resolution
}

export class YoutubeService {
    soundRepository: any
    constructor (soundRepository: any) {
        this.soundRepository = soundRepository
    }

    convertDurationInMinutes (duration: string) {
        const parts = duration.split(':').map(Number)

        let minutes = 0

        if (parts.length === 2) { // Formato MM:SS
            minutes = parts[0] + parts[1] / 60
        } else if (parts.length === 3) { // Formato HH:MM:SS
            minutes = parts[0] * 60 + parts[1] + parts[2] / 60
        }

        return minutes
    }

    async getSoundByYoutubeAPI ({ name }: { name: any }) {
        try {
            const result = await youtubesearchapi.GetListByKeyword(name, false)

            return result
        } catch (error) {
            return {
                items: []
            }
        }
    }

    async getSoundByIdOnYoutube ({ id }: { id: any }) {
        try {
            const yt = await getInnertube()
            const info = await yt.getBasicInfo(extractVideoId(id))
            const thumbnails = info.basic_info.thumbnail ?? []
            const getBestThumbnail = [...thumbnails]
                .sort((a: any, b: any) => (b.width ?? 0) - (a.width ?? 0))
                .slice(1, 3)

            return {
                title: info.basic_info.title,
                thumbnail: {
                    thumbnails: getBestThumbnail
                },
                id,
                type: 'video'
            }
        } catch (error) {
            return {}
        }
    }

    async searchSound ({ name }: { name: any }) {
        const youtube = await this.getSoundByYoutubeAPI({ name })
        const sounds = await this.soundRepository.getSoundByName({
            sound_name: name
        })
        const results: {
            items: any[],
            nextPage: any
        } = {
            items: [],
            nextPage: {}
        }
        for (const sound of sounds) {
            results.items.push({ type: 'sound', ...sound.dataValues })
        }
        for (const video of youtube.items) {
            if (video.type === 'video' && video.length && video.length.accessibility) {
                const minutes = this.convertDurationInMinutes(video.length.simpleText)
                if (minutes < 100) results.items.push(video)
            }
        }
        results.nextPage = youtube.nextPage

        return results
    }

    async getInfoSound ({ url }: { url: string }) {
        if (YOUTUBE_SERVICE_URL) {
            const remoteInfo = await getRemoteVideoInfo(url)
            if (remoteInfo) return remoteInfo
        }

        return await resolveVideoPlayback(url)
    }

    downloadSound ({ url, options, resolution }: { url: string, options: any, resolution?: any }) {
        const passThrough = new PassThrough()

        ;(async () => {
            try {
                if (YOUTUBE_SERVICE_URL) {
                    const remoteSound = await downloadRemoteVideo(url, options)
                    if (remoteSound) {
                        remoteSound.on('error', (err) => passThrough.destroy(err as Error))
                        remoteSound.pipe(passThrough)
                        return
                    }
                }

                const playback = resolution?.resolvedUrl ? resolution : await resolveVideoPlayback(url, options)

                const fetchHeaders: Record<string, string> = {
                    'User-Agent': 'com.google.android.youtube/17.36.4 (Linux; U; Android 12) gzip'
                }
                if (options?.range) {
                    fetchHeaders['Range'] = `bytes=${options.range.start}-${options.range.end}`
                }

                const response = await fetch(playback.resolvedUrl, { headers: fetchHeaders })

                if (!response.ok) {
                    passThrough.destroy(new Error(`YouTube fetch failed: ${response.status} ${response.statusText}`))
                    return
                }

                if (!response.body) {
                    passThrough.destroy(new Error('No response body'))
                    return
                }

                const reader = response.body.getReader()
                try {
                    while (true) {
                        const { done, value } = await reader.read()
                        if (done) break
                        passThrough.write(value)
                    }
                    passThrough.end()
                } catch (streamError) {
                    passThrough.destroy(streamError as Error)
                }
            } catch (error) {
                passThrough.destroy(error as Error)
            }
        })()

        return { sound: passThrough }
    }

    preloadSound ({ url, options }: { url: string, options: any }) {
        return new Promise((resolve, reject) => {
            let contentLength = 0

            const { sound } = this.downloadSound({ url, options })

            sound?.on('data', (chunk: any) => {
                contentLength += chunk.length
            })

            sound?.on('end', () => {
                resolve(contentLength)
            })

            sound?.on('error', (err: Error) => {
                reject(err)
            })
        })
    }
}
