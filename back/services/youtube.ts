import ytdl, { videoInfo } from '@distube/ytdl-core'
// @ts-ignore
import youtubesearchapi from 'youtube-search-api'

export class YoutubeService {
    soundRepository: any
    constructor (soundRepository: any) {
        this.soundRepository = soundRepository
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
        for (let i = 0; i < sounds.length; i++) {
            const sound = {
                type: 'sound'
            }
            Object.assign(sound, sounds[i].dataValues)
            results.items.push(sound)
        }
        for (let i = 0; i < youtube.items.length; i++) {
            const video = youtube.items[i]
            if (video.type === 'video' && video.length.accessibility && video.length.simpleText.match(/:/g).length === 1) {
                // delete videos larger than 10 minutes
                const minutes = video.length.simpleText.substring(0, video.length.simpleText.indexOf(':'))
                if (parseInt(minutes) < 11) results.items.push(video)
            }
        }
        results.nextPage = youtube.nextPage

        return results
    }

    async downloadSound ({ url }: { url: any }) {
        try {
            let sound: any = null
            const info: videoInfo = await ytdl.getInfo(url)
            const formats: any[] = info.formats ? info.formats : info.player_response.streamingData.formats
            const relatedVideos = info.related_videos.map((video) => {
                return {
                    id: video.id,
                    title: video.title?.replace(/[^a-zA-Z ]/g, ""),
                    thumbnail: video.thumbnails,
                    duration: video.length_seconds
                }
            })
            let getBestFormat = formats.filter((format: any) => {
                return format.hasAudio === true && format.container === 'mp4' && format.hasVideo === true
            })
            if (getBestFormat.length === 0) {
                getBestFormat = formats.filter((format: any) => {
                    return format.hasAudio === true && format.container === 'mp4'
                })
            }
            getBestFormat = getBestFormat.sort((a: any, b: any) => {
                if (parseInt(a.contentLength) < parseInt(b.contentLength)) {
                    return -1
                } else if (parseInt(a.contentLength) > parseInt(b.contentLength)) {
                    return 1
                } else {
                    return 0
                }
            })
            if (getBestFormat[0]) {
                const downloadAndStream = () => {
                    const options: {
                        quality?: any
                    } = {
                        quality: getBestFormat[0].itag
                    }
                    sound = ytdl(url, options)
                }
            
                downloadAndStream()
            }
            

            return {
                sound,
                relatedVideos
            }
        } catch (error) {
            return {
                sound: null,
                relatedVideos: []
            }
        }
    }
}