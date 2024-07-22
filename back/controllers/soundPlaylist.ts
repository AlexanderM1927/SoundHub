export class SoundPlaylistController {
    soundPlaylistModel: any
    youtubeService: any
    constructor (soundPlaylistModel: any, youtubeService: any) {
        this.soundPlaylistModel = soundPlaylistModel
        this.youtubeService = youtubeService
    }

    store = async (req: any, res: any) => {
        const result = req.body
    
        try {
            const savedSoundPlaylist = await this.soundPlaylistModel.create(result)
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
                sounds: any[]
            } = {
                sounds: []
            }
            playlist.sounds = await this.soundPlaylistModel.getSoundsByPlaylistId({playlist_id: req.params.playlist_id})
            for (let i = 0; i < playlist.sounds.length; i++) {
                if (playlist.sounds[i].youtube_id) {
                    const searchYt = await this.youtubeService.getSoundByYoutubeAPI({
                        name: playlist.sounds[i].youtube_id
                    })
                    const element = searchYt.items[0]
                    element.type = 'video'
                    element.sound_playlist_id = playlist.sounds[i].sound_playlist_id
                    playlist.sounds[i] = element
                } else {
                    playlist.sounds[i].sound = {
                        sound_id: playlist.sounds[i].sound_id,
                        sound_name: playlist.sounds[i].sound_name,
                        sound_file_url: playlist.sounds[i].sound_file_url,
                        sound_thumbnail_url: playlist.sounds[i].sound_thumbnail_url,
                        type: 'sound',
                        sound_playlist_id: playlist.sounds[i].sound_playlist_id
                    }
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