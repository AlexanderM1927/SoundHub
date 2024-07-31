export class SoundPlaylistController {
    soundPlaylistRepository: any
    youtubeService: any
    constructor (soundPlaylistRepository: any, youtubeService: any) {
        this.soundPlaylistRepository = soundPlaylistRepository
        this.youtubeService = youtubeService
    }

    store = async (req: any, res: any) => {
        const result = req.body
    
        try {
            const savedSoundPlaylist = await this.soundPlaylistRepository.create(result)
            res.json({
                error: null,
                data: savedSoundPlaylist
            })
        } catch (error) {
            res.status(400).json({error: (error as Error).message})
        }
    }

    get = async (req: any, res: any) => {
        try {
            const playlist: {
                playlist_name: any,
                sounds: any[]
            } = {
                playlist_name: '',
                sounds: []
            }
            playlist.sounds = await this.soundPlaylistRepository.getSoundsByPlaylistId({playlist_id: req.params.playlist_id})
            for (let i = 0; i < playlist.sounds.length; i++) {
                playlist.playlist_name = playlist.sounds[i].playlist_name
                if (playlist.sounds[i].youtube_id) {
                    const searchYt = await this.youtubeService.getSoundByYoutubeAPI({
                        name: playlist.sounds[i].youtube_id
                    })
                    const element = searchYt.items[0]
                    element.type = 'video'
                    element.sound_playlist_id = playlist.sounds[i].sound_playlist_id
                    playlist.sounds[i] = element
                } else {
                    playlist.sounds[i].sound.type = 'sound'
                }
            }
            
            res.json({
              error: null,
              data: playlist
            })
        } catch (error) {
            res.status(400).json({error: (error as Error).message})
        }
    }
}