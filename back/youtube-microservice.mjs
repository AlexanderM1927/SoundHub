import http from 'node:http'
import { Readable } from 'node:stream'
import { Innertube } from 'youtubei.js'
import 'dotenv/config.js'

const PORT = Number(process.env.YOUTUBE_PORT || 9000)
const INNERTUBE_TTL_MS = 30 * 60 * 1000
const RESOLUTION_CACHE_TTL_MS = 5 * 60 * 1000
const VIDEO_INFO_CLIENTS = ['ANDROID', 'WEB', 'IOS', 'WEB_EMBEDDED', 'TV_EMBEDDED']
const YOUTUBE_PO_TOKEN = process.env.YOUTUBE_PO_TOKEN?.trim() || process.env.PO_TOKEN?.trim() || undefined

let innertubeInstance = null
let innertubeCreatedAt = 0
const videoResolutionCache = new Map()

function json (res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  })
  res.end(JSON.stringify(payload))
}

function extractVideoId (urlOrId) {
  try {
    const parsed = new URL(urlOrId)
    return parsed.searchParams.get('v')
      || parsed.pathname.split('/').filter(Boolean).pop()
      || urlOrId
  } catch {
    return urlOrId
  }
}

async function getInnertube () {
  const now = Date.now()
  if (!innertubeInstance || (now - innertubeCreatedAt) > INNERTUBE_TTL_MS) {
    innertubeInstance = await Innertube.create({
      client_type: 'ANDROID',
      retrieve_player: true,
      po_token: YOUTUBE_PO_TOKEN
    })
    innertubeCreatedAt = now
  }
  return innertubeInstance
}

async function getVideoInfoWithFallback (videoId) {
  const yt = await getInnertube()
  let lastError = null
  let lastInfo = null

  for (const client of VIDEO_INFO_CLIENTS) {
    try {
      const info = await yt.getBasicInfo(videoId, {
        client,
        po_token: YOUTUBE_PO_TOKEN
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
    return { yt, info: lastInfo, client: 'ANDROID' }
  }

  throw lastError || new Error('Streaming data not available')
}

function getResolutionCacheKey (videoId, quality) {
  return `${videoId}:${quality ?? 'best'}`
}

function getCachedResolution (videoId, quality) {
  const key = getResolutionCacheKey(videoId, quality)
  const cached = videoResolutionCache.get(key)
  if (!cached) return null

  if ((Date.now() - cached.cachedAt) > RESOLUTION_CACHE_TTL_MS) {
    videoResolutionCache.delete(key)
    return null
  }

  return cached
}

function setCachedResolution (videoId, quality, resolution) {
  const key = getResolutionCacheKey(videoId, quality)
  videoResolutionCache.set(key, {
    ...resolution,
    cachedAt: Date.now()
  })
}

async function resolveVideoPlayback (videoId, options = {}) {
  const quality = options?.quality ?? 'best'
  const cached = getCachedResolution(videoId, quality)
  if (cached) return cached

  const { yt, info } = await getVideoInfoWithFallback(videoId)

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
      // best effort only
    }
  }

  const resolution = {
    contentLength,
    itag: format?.itag,
    container,
    resolvedUrl
  }

  setCachedResolution(videoId, quality, resolution)
  if (resolution.itag !== quality) {
    setCachedResolution(videoId, resolution.itag, resolution)
  }
  return resolution
}

async function handleHealth (res) {
  json(res, 200, { ok: true })
}

async function handleInfo (res, videoId) {
  const resolution = await resolveVideoPlayback(extractVideoId(videoId))

  json(res, 200, {
    contentLength: resolution.contentLength,
    itag: resolution.itag,
    container: resolution.container,
    relatedVideos: []
  })
}

async function handleDownload (req, res, videoId) {
  const requestedQuality = urlSearchToNumber(req.url, 'quality')
  const resolution = await resolveVideoPlayback(extractVideoId(videoId), { quality: requestedQuality })

  const headers = {
    'User-Agent': 'com.google.android.youtube/17.36.4 (Linux; U; Android 12) gzip'
  }
  const hasRangeRequest = Boolean(req.headers.range && resolution.contentLength)
  let startRange = 0
  let endRange = resolution.contentLength ? resolution.contentLength - 1 : 0

  if (hasRangeRequest) {
    const rangePosition = req.headers.range.replace(/bytes=/, '').split('-')
    startRange = parseInt(rangePosition[0], 10)
    if (rangePosition[1]) {
      endRange = parseInt(rangePosition[1], 10)
    }

    headers.Range = `bytes=${startRange}-${endRange}`
  }

  const response = await fetch(resolution.resolvedUrl, { headers })
  if (!response.ok) {
    throw new Error(`YouTube fetch failed: ${response.status} ${response.statusText}`)
  }
  if (!response.body) {
    throw new Error('No response body')
  }

  if (hasRangeRequest) {
    const chunkSize = (endRange - startRange) + 1
    res.writeHead(206, {
      'Content-Type': `video/${resolution.container}`,
      'Content-Length': chunkSize,
      'Content-Range': `bytes ${startRange}-${endRange}/${resolution.contentLength}`,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-store'
    })
  } else {
    res.writeHead(200, {
      'Content-Type': `video/${resolution.container}`,
      'Accept-Ranges': resolution.contentLength ? 'bytes' : 'none',
      'Cache-Control': 'no-store'
    })
  }

  const stream = Readable.fromWeb(response.body)
  stream.on('error', (error) => {
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' })
    }
    res.end(JSON.stringify({ error: error.message }))
  })
  stream.pipe(res)
}

function urlSearchToNumber (requestUrl, key) {
  try {
    const parsed = new URL(requestUrl || '/', 'http://localhost')
    const value = parsed.searchParams.get(key)
    if (!value) return undefined
    const parsedNumber = Number(value)
    return Number.isNaN(parsedNumber) ? undefined : parsedNumber
  } catch {
    return undefined
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)
    const method = req.method || 'GET'
    const parts = url.pathname.split('/').filter(Boolean)

    if (method === 'GET' && url.pathname === '/health') {
      await handleHealth(res)
      return
    }

    if (method === 'GET' && parts[0] === 'info' && parts[1]) {
      await handleInfo(res, decodeURIComponent(parts.slice(1).join('/')))
      return
    }

    if (method === 'GET' && parts[0] === 'download' && parts[1] === 'video' && parts[2]) {
      await handleDownload(req, res, decodeURIComponent(parts.slice(2).join('/')))
      return
    }

    json(res, 404, { error: 'Not found' })
  } catch (error) {
    json(res, 400, { error: error.message || 'Unknown error' })
  }
})

server.on('error', (error) => {
  console.error('SoundHub YouTube microservice error:', error)
  process.exitCode = 1
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`SoundHub YouTube microservice listening on 0.0.0.0:${PORT}`)
})
