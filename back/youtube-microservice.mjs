import 'dotenv/config'
import http from 'node:http'
import { Readable } from 'node:stream'
import { Innertube } from 'youtubei.js'

const PORT = Number(process.env.PORT || 9000)
const INNERTUBE_TTL_MS = 30 * 60 * 1000
const VIDEO_INFO_CLIENTS = ['ANDROID', 'WEB', 'IOS', 'WEB_EMBEDDED', 'TV_EMBEDDED']
const YOUTUBE_PO_TOKEN = process.env.YOUTUBE_PO_TOKEN?.trim() || process.env.PO_TOKEN?.trim() || undefined

let innertubeInstance = null
let innertubeCreatedAt = 0

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

async function handleHealth (res) {
  json(res, 200, { ok: true })
}

async function handleInfo (res, videoId) {
  const { yt, info } = await getVideoInfoWithFallback(extractVideoId(videoId))

  if (!info.streaming_data?.formats?.length && !info.streaming_data?.adaptive_formats?.length) {
    const reason = info.playability_status?.reason || info.playability_status?.status || 'unknown'
    throw new Error(`Streaming data not available (${reason})`)
  }

  const format = info.chooseFormat({
    type: 'video+audio',
    format: 'mp4'
  })

  const resolvedUrl = await format.decipher(yt.session.player)
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

  json(res, 200, {
    contentLength,
    itag: format?.itag,
    container,
    relatedVideos: []
  })
}

async function handleDownload (req, res, videoId) {
  const { yt, info } = await getVideoInfoWithFallback(extractVideoId(videoId))

  if (!info.streaming_data?.formats?.length && !info.streaming_data?.adaptive_formats?.length) {
    const reason = info.playability_status?.reason || info.playability_status?.status || 'unknown'
    throw new Error(`Streaming data not available (${reason})`)
  }

  const format = info.chooseFormat({
    type: 'video+audio',
    format: 'mp4'
  })
  const resolvedUrl = (await format.decipher(yt.session.player)) || format.url

  if (!resolvedUrl) {
    const reason = info.playability_status?.reason || info.playability_status?.status || 'unknown'
    throw new Error(`No suitable format found (${reason})`)
  }

  const headers = {
    'User-Agent': 'com.google.android.youtube/17.36.4 (Linux; U; Android 12) gzip'
  }
  if (req.headers.range) {
    headers.Range = req.headers.range
  }

  const response = await fetch(resolvedUrl, { headers })
  if (!response.ok) {
    throw new Error(`YouTube fetch failed: ${response.status} ${response.statusText}`)
  }
  if (!response.body) {
    throw new Error('No response body')
  }

  res.writeHead(200, {
    'Content-Type': format.mime_type || 'video/mp4',
    'Cache-Control': 'no-store'
  })

  const stream = Readable.fromWeb(response.body)
  stream.on('error', (error) => {
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' })
    }
    res.end(JSON.stringify({ error: error.message }))
  })
  stream.pipe(res)
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

server.listen(PORT, () => {
  console.log(`SoundHub YouTube microservice listening on port ${PORT}`)
})
