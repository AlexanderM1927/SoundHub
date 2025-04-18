import ytdl, { videoInfo, videoFormat } from '@distube/ytdl-core'
// @ts-ignore
import youtubesearchapi from 'youtube-search-api'

export class YoutubeService {
    soundRepository: any
    constructor (soundRepository: any) {
        this.soundRepository = soundRepository
    }

    convertDurationInMinutes (duration: string) {
        const parts = duration.split(':').map(Number)

        let minutes = 0;

        if (parts.length === 2) { // Formato MM:SS
            minutes = parts[0] + parts[1] / 60;
        } else if (parts.length === 3) { // Formato HH:MM:SS
            minutes = parts[0] * 60 + parts[1] + parts[2] / 60;
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
            if (video.type === 'video' && video.length && video.length.accessibility) {
                // delete videos larger than 10 minutes
                const minutes = this.convertDurationInMinutes(video.length.simpleText)
                if (minutes < 100) results.items.push(video)
            }
        }
        results.nextPage = youtube.nextPage

        return results
    }


    async getInfoSound ({ url }: { url: string}) {
        const info: videoInfo = await ytdl.getInfo(url)
        const formats: videoFormat[] = info.formats ? info.formats : (info.player_response.streamingData.formats as videoFormat[])
        // const audioFormat = ytdl.chooseFormat(info.formats, {
        //     quality: "lowestaudio"
        // })
        const audioFormats = formats.filter((format: videoFormat) => {
            return format.container === 'mp4' && format.hasVideo && format.hasAudio
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
            contentLength: audioFormats[0].contentLength,
            itag: audioFormats[0].itag,
            container: audioFormats[0].container,
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

    preloadSound ({ url, options }: { url: string, options: any }) {
        return new Promise((resolve, reject) => {
            let contentLength = 0;

            const { sound } = this.downloadSound({ url, options})

            sound?.on('data', (chunk: any) => {
                contentLength += chunk.length;
            });

            sound?.on('end', () => {
                resolve(contentLength)
            })

            sound?.on('fail', () => {
                reject()
            })
        })
    }
}