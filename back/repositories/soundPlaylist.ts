import moment from 'moment'

export class SoundPlaylistRepository {
    connection: any
    constructor ({ connection }: {connection: any}) {
        this.connection = connection
    }

    async getSoundsByPlaylistId ({ playlist_id }: {playlist_id: Number}) {
        const query = await this.connection.query(
            `SELECT sounds_playlists.*, sounds.*, playlists.*
            FROM sounds_playlists 
            LEFT JOIN sounds ON sounds.sound_id = sounds_playlists.sound_id
            LEFT JOIN playlists ON playlists.playlist_id = sounds_playlists.playlist_id
            WHERE sounds_playlists.playlist_id = ?;`,
            [playlist_id]
        )
        return query[0]
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
            await this.connection.query(
              `INSERT INTO sounds_playlists (
                playlist_id, 
                sound_id, 
                youtube_id,
                createdAt, 
                updatedAt)
                VALUES (?, ?, ?, ?, ?);`,
                [
                    playlist_id, 
                    sound_id,
                    youtube_id,
                    moment().format('YYYY-MM-DD HH:mm:ss'), 
                    moment().format('YYYY-MM-DD HH:mm:ss')
                ]
            )

            return {
                playlist_id,
                sound_id,
                youtube_id
            }
        } catch (e) {
            console.log(e)
            throw new Error('Error creating sound playlist item')
        }
    }
}