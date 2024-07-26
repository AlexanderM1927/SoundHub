import moment from 'moment'

export class SoundRepository {
    connection: any
    constructor ({ connection }: {connection: any}) {
        this.connection = connection
    }

    async getSoundByName ({ sound_name }: {sound_name: String}) {
        const query = await this.connection.query(
            `SELECT * FROM sounds WHERE sound_name LIKE ?;`,
            [`%${sound_name}%`]
        )
        return query[0]
    } 

    async getSoundById ({ sound_id }: {sound_id: Number}) {
        const query = await this.connection.query(
            `SELECT sounds.*, users.* FROM sounds 
            LEFT JOIN users ON users.user_id = sounds.user_id 
            WHERE sound_id = ?;`,
            [sound_id]
        )
        return query[0][0]
    }

    async getSoundByUserId ({ user_id }: {user_id: Number}) {
        const query = await this.connection.query(
            `SELECT * FROM sounds WHERE user_id = ?;`,
            [user_id]
        )
        return query[0]
    }

    async create ({
        sound_name, 
        sound_file_url, 
        sound_thumbnail_url, 
        user_id
    }: {
        sound_name: String, 
        sound_file_url: String, 
        sound_thumbnail_url: String, 
        user_id: Number
    }) {
        try {
            await this.connection.query(
              `INSERT INTO sounds (
                sound_name, 
                sound_file_url, 
                sound_thumbnail_url, 
                user_id, 
                createdAt, 
                updatedAt)
                VALUES (?, ?, ?, ?, ?, ?);`,
                [
                    sound_name, 
                    sound_file_url, 
                    sound_thumbnail_url, 
                    user_id, 
                    moment().format('YYYY-MM-DD HH:mm:ss'), 
                    moment().format('YYYY-MM-DD HH:mm:ss')
                ]
            )

            return {
                sound_name,
                sound_file_url,
                sound_thumbnail_url,
                user_id
            }
        } catch (e) {
            console.log(e)
            throw new Error('Error creating sound')
        }
    }
}