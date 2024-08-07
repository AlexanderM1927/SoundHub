import { UploadService } from "../services/upload"
import path from 'path'
import { fileURLToPath } from 'url'
import fileSystem from 'fs'

const TYPE_VIDEO = 'video'
export class SoundController {
    soundRepository: any
    viewRepository: any
    youtubeService: any
    userRepository: any
    playlistRepository: any

    constructor (
            soundRepository: any, 
            viewRepository: any, 
            youtubeService: any, 
            userRepository: any, 
            playlistRepository: any
    ) {
        this.soundRepository = soundRepository
        this.viewRepository = viewRepository
        this.youtubeService = youtubeService
        this.userRepository = userRepository
        this.playlistRepository = playlistRepository
    }

    search = async (req: any, res: any) => {
        try {
            const name = req.params.name

            const sounds = await this.youtubeService.searchSound({ name })
            let users = await this.userRepository.getUserByUserName({ user_name: name })
            let playlists = await this.playlistRepository.getPlaylistsByName({ playlist_name: name })

            if (users && users.length > 0) {
                users = users.map((usr: any) => {
                    return {
                        ...usr.dataValues,
                        type: 'user'
                    }
                })
            }

            if (playlists && playlists.length > 0) {
                playlists = playlists.map((playlist: any) => {
                    return {
                        ...playlist.dataValues,
                        type: 'playlist'
                    }
                })
            }

            const results = {
                items: [
                    ...users,
                    ...playlists,
                    ...sounds.items
                ]
            }
            
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
            // const userAgent = req.headers['user-agent'];
            let response = null
            let soundUrl = ''
            let nextVideos: any = []
          
            if (type === TYPE_VIDEO) {
                const {
                    sound,
                    relatedVideos
                } = await this.youtubeService.downloadSound({ url, type })
                nextVideos = [...relatedVideos].filter((obj) => {
                    return parseInt(obj.duration) < 500
                }).slice(0, 10)
                response = sound
            } else {
                const sound = await this.soundRepository.getSoundById({
                    sound_id: url
                })
                if (sound) {
                    const __dirname = path.dirname(fileURLToPath(import.meta.url))
                    soundUrl = path.join(__dirname.replace('v1', '').replace('dist', '').replace('controllers', ''), sound.sound_file_url);
                    response = fileSystem.createReadStream(soundUrl);
                }
            }

            if (response) {

                res.setHeader('Access-Control-Expose-Headers', 'Related-Videos')
                res.setHeader("Content-Type", "audio/mpeg");
                res.setHeader("Accept-Ranges", "bytes");
                res.setHeader("Connection", "Keep-Alive");
                res.setHeader("Transfer-encoding", "chunked");
                console.log('nextVideos', nextVideos)
                res.setHeader("Related-Videos", JSON.stringify(nextVideos))
                response.pipe(res)

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
                const soundFromDB = await this.soundRepository.getSoundById({ sound_id: parseInt(sound_id) })
                sound = {
                    sound_name: soundFromDB.sound_name,
                    sound_id: soundFromDB.sound_id,
                    user_id: soundFromDB.user_id,
                    type: 'sound',
                    user: {
                        user_name: soundFromDB.dataValues.user,
                    }
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
            const uploadService = new UploadService(this.soundRepository)
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

            const sounds = await this.soundRepository.getSoundByUserId({ user_id: parseInt(user_id) })
            for (let i = 0; i < sounds.length; i++) {
                const sound = {
                    type: 'sound'
                }
                Object.assign(sound, sounds[i].dataValues)
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
