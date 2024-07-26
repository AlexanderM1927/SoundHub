import moment from 'moment'

export class PlaylistRepository {
    connection: any
    constructor ({ connection }: {connection: any}) {
        this.connection = connection
    }

    async getPlaylistById ({ playlist_id }: {playlist_id: Number}) {
        const query = await this.connection.query(
            `SELECT * FROM playlists WHERE playlist_id = ?;`,
            [playlist_id]
        )
        return query[0][0]
    }

    async getPlaylistsByName ({ playlist_name }: {playlist_name: string}) {
        const query = await this.connection.query(
            `SELECT * FROM playlists WHERE playlist_name = ?;`,
            [playlist_name]
        )
        return query[0]
    }

    async getPlaylistByUserId ({ user_id }: {user_id: Number}) {
        const query = await this.connection.query(
            `SELECT * FROM playlists WHERE user_id = ?;`,
            [user_id]
        )
        return query[0]
    }

    async create ({
        user_id,
        playlist_name
    }: {
        user_id: Number,
        playlist_name: String
    }) {
        try {
            await this.connection.query(
              `INSERT INTO playlists (
                user_id, 
                playlist_name, 
                createdAt, 
                updatedAt)
                VALUES (?, ?, ?, ?);`,
                [
                    user_id, 
                    playlist_name, 
                    moment().format('YYYY-MM-DD HH:mm:ss'), 
                    moment().format('YYYY-MM-DD HH:mm:ss')
                ]
            )

            return {
                playlist_name,
                user_id
            }
        } catch (e) {
            console.log(e)
            throw new Error('Error creating playlist')
        }
    }
}