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
            let _contentLength = 0
          
            if (type === TYPE_VIDEO) {
                const {
                    contentLength,
                    itag,
                    container
                } = await this.youtubeService.getInfoSound({ url })  

                const soundDefaultOptions = {
                    url: url,
                    options: {
                        quality: itag
                    }
                }

                const { sound } = this.youtubeService.downloadSound(soundDefaultOptions)

                if (!contentLength) {
                    _contentLength = await this.youtubeService.preloadSound(soundDefaultOptions)
                } else {
                    _contentLength = contentLength
                }

                const rangeHeader = req.headers.range || null;
                let startRange = 0;
                let endRange = _contentLength - 1;  // Si no hay rango, envía todo el contenido

                if (rangeHeader) {
                    const rangePosition = rangeHeader.replace(/bytes=/, "").split("-");
                    startRange = parseInt(rangePosition[0], 10);

                    // Si rangePosition[1] es undefined o una cadena vacía, usa el valor por defecto (_contentLength - 1)
                    if (rangePosition[1]) {
                        endRange = parseInt(rangePosition[1], 10);
                    }
                }

                const chunksize = (endRange - startRange) + 1;

                const headers: any = {
                    'Content-Type': `video/${container}`,
                    'Content-Length': chunksize,
                    "Content-Range": "bytes " + startRange + "-" + endRange + "/" + _contentLength,
                    "Accept-Ranges": "bytes"
                }

                res.writeHead(206, headers)

                const range = { start: startRange, end: endRange }

                if (rangeHeader) {
                    const theSound = this.youtubeService.downloadSound({
                        url: url,
                        options: {
                            quality: itag,
                            range
                        }
                    })
                    theSound.sound.pipe(res)
                } else {
                    sound.pipe(res)
                }
            } else {
                const sound = await this.soundRepository.getSoundById({
                    sound_id: url
                })
                if (sound) {
                    const __dirname = path.dirname(fileURLToPath(import.meta.url))
                    const soundUrl = path.join(__dirname.replace('v1', '').replace('dist', '').replace('controllers', ''), sound.sound_file_url)
                    const soundStream = fileSystem.createReadStream(soundUrl)

                    res.setHeader("Content-Type", "audio/mpeg");
                    res.setHeader("Accept-Ranges", "bytes");
                    res.setHeader("Connection", "Keep-Alive");
                    res.setHeader("Content-Length", fileSystem.statSync(soundUrl).size);
                    res.setHeader("Transfer-encoding", "chunked");

                    soundStream.pipe(res)
                } else {
                    res.status(404).json({ error: "Sound not found" });
                }
            }

        } catch (error) {
            res.status(400).json({error: (error as Error).message})
        }  
    }

    getRelatedVideos = async (req: any, res: any) => {
        try {
            const url = req.params.url;
            const {
                relatedVideos
            } = await this.youtubeService.getInfoSound({ url })
            const nextVideos = [...relatedVideos].filter((obj) => {
                return parseInt(obj.duration) < 500
            }).slice(0, 10) 

            res.json({
                error: null,
                data: nextVideos
              })
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
                const youtubeSearch = await this.youtubeService.getSoundByIdOnYoutube({
                    id: sound_id
                })
                sound = youtubeSearch
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
