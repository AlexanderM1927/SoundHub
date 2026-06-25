import { Innertube } from 'youtubei.js'
import { PassThrough } from 'node:stream'
// @ts-ignore
import youtubesearchapi from 'youtube-search-api'

let innertubeInstance: Innertube | null = null
let innertubeCreatedAt: number = 0
const INNERTUBE_TTL_MS = 30 * 60 * 1000 // 30 minutes

async function getInnertube (): Promise<Innertube> {
    const now = Date.now()
    if (!innertubeInstance || (now - innertubeCreatedAt) > INNERTUBE_TTL_MS) {
        innertubeInstance = await Innertube.create({
            client_type: 'ANDROID' as any,
            retrieve_player: false
        })
        innertubeCreatedAt = now
    }
    return innertubeInstance
}

function extractVideoId (urlOrId: string): string {
    try {
        const parsed = new URL(urlOrId)
        return parsed.searchParams.get('v') ?? urlOrId
    } catch {
        return urlOrId
    }
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
        let yt = await getInnertube()
        let info: Awaited<ReturnType<typeof yt.getBasicInfo>>
        try {
            info = await yt.getBasicInfo(extractVideoId(url))
        } catch {
            // Session may have expired; force recreation and retry once
            innertubeInstance = null
            yt = await getInnertube()
            info = await yt.getBasicInfo(extractVideoId(url))
        }

        const allFormats = [
            ...(info.streaming_data?.formats ?? []),
            ...(info.streaming_data?.adaptive_formats ?? [])
        ]

        const audioFormats = allFormats.filter((format) => {
            return format.mime_type.includes('video/mp4') && format.has_video && format.has_audio
        })

        const format = audioFormats[0]
        const container = format?.mime_type.split('/')[1]?.split(';')[0]?.trim() ?? 'mp4'

        let contentLength = format?.content_length

        // If YouTube didn't include content_length in metadata, resolve it with a
        // lightweight HEAD request so range/seek support is always available.
        if (!contentLength && format?.url) {
            try {
                const head = await fetch(format.url, {
                    method: 'HEAD',
                    headers: { 'User-Agent': 'com.google.android.youtube/17.36.4 (Linux; U; Android 12) gzip' }
                })
                const cl = head.headers.get('content-length')
                if (cl) contentLength = parseInt(cl, 10)
            } catch {
                // non-fatal: will fall back to chunked stream without range support
            }
        }

        const relatedVideos: any[] = []

        return {
            contentLength,
            itag: format?.itag,
            container,
            relatedVideos
        }
    }

    downloadSound ({ url, options }: { url: string, options: any }) {
        const passThrough = new PassThrough()

        ;(async () => {
            try {
                let yt = await getInnertube()
                let info: Awaited<ReturnType<typeof yt.getBasicInfo>>
                try {
                    info = await yt.getBasicInfo(extractVideoId(url))
                } catch {
                    innertubeInstance = null
                    yt = await getInnertube()
                    info = await yt.getBasicInfo(extractVideoId(url))
                }

                const allFormats = [
                    ...(info.streaming_data?.formats ?? []),
                    ...(info.streaming_data?.adaptive_formats ?? [])
                ]

                // For ANDROID client, format.url is populated directly (no deciphering needed)
                const format = allFormats.find((f: any) => f.itag === options?.quality && f.url)
                    ?? allFormats.find((f: any) => f.url && f.has_video && f.has_audio)
                    ?? allFormats.find((f: any) => f.url)

                if (!format?.url) {
                    passThrough.destroy(new Error('No suitable format found'))
                    return
                }

                const fetchHeaders: Record<string, string> = {
                    'User-Agent': 'com.google.android.youtube/17.36.4 (Linux; U; Android 12) gzip'
                }
                if (options?.range) {
                    fetchHeaders['Range'] = `bytes=${options.range.start}-${options.range.end}`
                }

                const response = await fetch(format.url, { headers: fetchHeaders })

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
