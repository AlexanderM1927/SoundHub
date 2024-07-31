// @ts-ignore
import { soundPlaylist as SoundPlaylist, playlist as Playlist, sound as Sound } from '../models'

export class SoundPlaylistRepository {
    
    constructor () {
        
    }

    async getSoundsByPlaylistId ({ playlist_id }: {playlist_id: Number}) {
        const query = await SoundPlaylist.findAll({
            where: {
              playlist_id: playlist_id
            },
            include: [{
              model: Sound
            }, {
              model: Playlist
            }]
          })
        return query
    }

    async create ({
        playlist_id,
        sound_id,
        youtube_id
    }: {
        playlist_id: Number,
        sound_id: Number,
        youtube_id: String
    }) {
        try {
            const data: {
                playlist_id: Number,
                sound_id?: Number
                youtube_id?: String
            } = {
                playlist_id: playlist_id
            }
            if (sound_id) data.sound_id = sound_id
            else if (youtube_id) data.youtube_id = youtube_id
            const sound_paylist = new SoundPlaylist(data)
            const soundPlaylistSaved = await sound_paylist.save()

            return soundPlaylistSaved
        } catch (e) {
            console.log(e)
            throw new Error('Error creating sound playlist item')
        }
    }
}