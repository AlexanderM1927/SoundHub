import { Op } from 'sequelize'
// @ts-ignore
import { playlist as Playlist } from '../models'

export class PlaylistRepository {
    
    constructor () {
        
    }

    async getPlaylistById ({ playlist_id }: {playlist_id: Number}) {
        const playlist = await Playlist.findOne({ 
            where: {
              playlist_id
            }
        })

        return playlist
    }

    async getPlaylistsByName ({ playlist_name }: {playlist_name: string}) {
        const playlists = await Playlist.findAll({ 
            where: {
                playlist_name: {
                    [Op.like]: '%' + playlist_name + '%'
                }
            }
        })

        return playlists
    }

    async getPlaylistByUserId ({ user_id }: {user_id: Number}) {
        const playlist = await Playlist.findAll({ 
            where: {
                user_id
            }
        })

        return playlist
    }

    async create ({
        user_id,
        playlist_name
    }: {
        user_id: Number,
        playlist_name: String
    }) {
        try {
            const playlist = new Playlist({
                user_id,
                playlist_name
            });
            await playlist.save()

            return playlist
        } catch (e) {
            console.log(e)
            throw new Error('Error creating playlist')
        }
    }
}