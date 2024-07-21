import ytdl, { Filter } from '@distube/ytdl-core'
// @ts-ignore
import youtubesearchapi from 'youtube-search-api'

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
        const downloadAndStream = (_format: any, hasFilter = false) => {
            const options: {
                quality: string,
                filter: Filter
            } = {
                quality: 'lowest',
                filter: 'audioonly'
            }
            if (hasFilter) options.filter = 'audioonly'
            response = ytdl(url, options)
        }
    
        if (userAgent && (userAgent.includes('iPhone') || userAgent.includes('iPad'))) {
            downloadAndStream('mp3');
        } else {
            downloadAndStream('m4a', true);
        }

        return response
    }
}