import { UploadService } from "../services/upload"
import path from 'path'
import { fileURLToPath } from 'url'
import fileSystem from 'fs'

const TYPE_VIDEO = 'video'
export class SoundController {
    soundModel: any
    viewModel: any
    youtubeService: any

    constructor (soundModel: any, viewModel: any, youtubeService: any) {
        this.soundModel = soundModel
        this.viewModel = viewModel
        this.youtubeService = youtubeService
    }

    search = async (req: any, res: any) => {
        try {
            const name = req.params.name

            const results = await this.youtubeService.searchSound({ name })
            
            res.json({
              error: null,
              data: results
            })
        } catch (error) {
            res.status(400).json({error: (error as Error).message})
        }
    }

    download = async (req: any, res: any) => {
        try {
            const url = req.params.url;
            const type = req.params.type;
            const userAgent = req.headers['user-agent'];
            let response = null
            let soundUrl = ''
          
            if (type === TYPE_VIDEO) {
                const sound = await this.youtubeService.downloadSound({ url, type, userAgent })
                soundUrl = await this.youtubeService.waitUntilDownloadSound({
                    file: sound,
                    url: url
                })
                response = fileSystem.createReadStream(soundUrl)
            } else {
                const sound = await this.soundModel.getSoundById({
                    sound_id: url
                })
                if (sound) {
                    const __dirname = path.dirname(fileURLToPath(import.meta.url))
                    soundUrl = path.join(__dirname.replace('v1', '').replace('controllers', ''), sound.sound_file_url);
                    response = fileSystem.createReadStream(soundUrl);
                }
            }

            if (response) {

                res.setHeader("Content-Type", "audio/mpeg");
                res.setHeader("Accept-Ranges", "bytes");
                res.setHeader("Connection", "Keep-Alive");
                res.setHeader("Transfer-encoding", "chunked");
                res.setHeader("Content-Length", fileSystem.statSync(soundUrl).size);
                response.pipe(res)
            
                const data = {
                    sound_id: url,
                    view_type: type
                }
                await this.viewModel.createView(data)
            }
        } catch (error) {
            res.status(400).json({error: (error as Error).message})
        }  
    }

    getSoundById = async (req: any, res: any) => {
        try {
            const type = req.params.type
            const sound_id = req.params.id
            let sound = null
            if (type === 'sound') {
                const soundFromDB = await this.soundModel.getSoundById({ sound_id: parseInt(sound_id) })
                sound = {
                    type: 'sound'
                }
                Object.assign(sound, soundFromDB.dataValues)
            } else {
                const youtubeSearch = await this.youtubeService.getSoundByYoutubeAPI({
                    name: sound_id
                })
                sound = youtubeSearch.items[0]
            }
            res.json({
              error: null,
              data: sound
            })
          } catch (error) {
            res.status(400).json({error: (error as Error).message})
          }
    }

    store = async (req: any, res: any) => {
        try {
            const uploadService = new UploadService(this.soundModel)
            uploadService.init(req, res)
        } catch (error) {
            res.status(400).json({error: (error as Error).message})
        }
    }

    showByUser = async (req: any, res: any) => {
        try {
            const user_id = req.params.user_id
            const results: {
                items: any[],
                nextPage: any
            } = {
                items: [],
                nextPage: {}
            }

            const sounds = await this.soundModel.getSoundByUserId({ user_id: parseInt(user_id) })
            for (let i = 0; i < sounds.length; i++) {
                const sound = {
                    type: 'sound'
                }
                Object.assign(sound, sounds[i])
                results.items.push(sound)
            }
            
            res.json({
              error: null,
              data: results
            })
        } catch (error) {
            res.status(400).json({error: (error as Error).message})
        }
    }
}