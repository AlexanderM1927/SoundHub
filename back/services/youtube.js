import ytdl from '@distube/ytdl-core'
import youtubesearchapi from 'youtube-search-api'

export class YoutubeService {
    constructor (soundModel) {
        this.soundModel = soundModel
    }

    async getSoundByYoutubeAPI ({ name }) {
        const result = await youtubesearchapi.GetListByKeyword(name, false)

        return result
    }

    async searchSound ({ name }) {
        const youtube = await this.getSoundByYoutubeAPI({ name })
        const sounds = await this.soundModel.getSoundByName({
            sound_name: name
        })
        const results = {
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

    async downloadSound ({ url, type, userAgent }) {
        let response = null
        if (type === 'video') {
            const downloadAndStream = (format, hasFilter = false) => {
                const options = {
                    quality: 'lowest',
                    format: format
                }
                if (hasFilter) options.filter = 'audioonly'
                response = ytdl(url, options)
            }
        
            if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
                downloadAndStream('mp3');
            } else {
                downloadAndStream('m4a', true);
            }
        } else {
            const sound = await this.soundModel.getSoundByName({
                sound_name: url
            })
            if (sound && sound[0]) {
                const filePath = path.join(__dirname.replace('v1', '').replace('controllers', ''), sound[0].sound_file_url);
                const readStream = fileSystem.createReadStream(filePath);
                response = readStream
            }
        }

        return response
    }
}