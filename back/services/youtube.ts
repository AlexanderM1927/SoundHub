import ytdl from '@distube/ytdl-core'
// @ts-ignore
import youtubesearchapi from 'youtube-search-api'
import fileSystem from 'fs'

export class YoutubeService {
    soundRepository: any
    constructor (soundRepository: any) {
        this.soundRepository = soundRepository
    }

    async getSoundByYoutubeAPI ({ name }: { name: any }) {
        const result = await youtubesearchapi.GetListByKeyword(name, false)

        return result
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
            Object.assign(sound, sounds[i])
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
        let response: any = null
        const info = await ytdl.getInfo(url)
        const getBestFormat = info.formats.filter((format: any) => {
            return format.hasAudio === true && format.container === 'mp4' && format.hasVideo === true
        })
        if (getBestFormat[0]) {
            const downloadAndStream = () => {
                const options: {
                    quality?: any
                } = {
                    quality: getBestFormat[0].itag
                }
                response = ytdl(url, options)
            }
        
            downloadAndStream()
        }
        

        return response
    }

    waitUntilDownloadSound ({file, url}: {file: any, url: any}) {
        const fileFS = fileSystem.createWriteStream(`./public/sounds/${url}.mp3`)
        return new Promise((resolve, reject) => {
            file.pipe(fileFS)
                .on('finish', () => resolve(`./public/sounds/${url}.mp3`))
                .on('error', reject)
        })
    }
}