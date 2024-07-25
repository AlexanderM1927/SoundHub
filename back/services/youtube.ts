import ytdl, { Filter } from '@distube/ytdl-core'
// @ts-ignore
import youtubesearchapi from 'youtube-search-api'
import fileSystem from 'fs'

export class YoutubeService {
    soundModel: any
    constructor (soundModel: any) {
        this.soundModel = soundModel
    }

    async getSoundByYoutubeAPI ({ name }: { name: any }) {
        const result = await youtubesearchapi.GetListByKeyword(name, false)

        return result
    }

    async searchSound ({ name }: { name: any }) {
        const youtube = await this.getSoundByYoutubeAPI({ name })
        const sounds = await this.soundModel.getSoundByName({
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

    async downloadSound ({ url, userAgent }: { url: any, userAgent: any }) {
        let response: any = null
        const downloadAndStream = async (format: any, hasFilter = false) => {
            const options: {
                quality?: string,
                filter?: Filter,
                format?: any
            } = {
                quality: 'lowest',
                format: format
            }
            if (hasFilter) options.filter = 'audioonly'
            response = await ytdl(url, options)
        }
    
        if (userAgent && (userAgent.includes('iPhone') || userAgent.includes('iPad'))) {
            await downloadAndStream('mp3');
        } else {
            await downloadAndStream('m4a', true);
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