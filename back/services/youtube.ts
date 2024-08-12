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

    async getSoundByIdOnYoutube ({ id }: { id: any }) {
        try {
            const info: videoInfo = await ytdl.getInfo(id)
            const getBestThumbnail = info.videoDetails.thumbnails.sort((a: any, b: any) => {
                if (parseInt(a.width) < parseInt(b.width)) {
                    return 1
                } else if (parseInt(a.width) > parseInt(b.width)) {
                    return -1
                } else {
                    return 0
                }
            }).slice(1,3)

            return {
                title: info.videoDetails.title,
                thumbnail: {
                    thumbnails: getBestThumbnail
                },
                id: id,
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


    async getInfoSound ({ url }: { url: string}) {
        const info: videoInfo = await ytdl.getInfo(url)
        const audioFormat = ytdl.chooseFormat(info.formats, {
            quality: "lowestaudio"
        })
        
        const relatedVideos = info.related_videos.map((video) => {
            return {
                id: video.id,
                title: video.title?.replace(/[^a-zA-Z ]/g, ""),
                thumbnail: video.thumbnails,
                duration: video.length_seconds
            }
        })


        return {
            contentLength: audioFormat.contentLength,
            itag: audioFormat.itag,
            container: audioFormat.container,
            relatedVideos
        }
    }

    downloadSound ({ url, options }: { url: string, options: any }) {
        try {
            return {
                sound: ytdl(url, options)
            }
        } catch (error) {
            return {
                sound: null
            }
        }
    }
}