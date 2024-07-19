import moment from 'moment'

export class SoundModel {
    constructor ({ connection }) {
        this.connection = connection
    }

    async getSoundByName ({ sound_name }) {
        const query = await this.connection.query(
            `SELECT * FROM sounds WHERE sound_name LIKE ?;`,
            [`%${sound_name}%`]
        )
        return query[0]
    } 

    async getSoundById ({ sound_id }) {
        const query = await this.connection.query(
            `SELECT * FROM sounds WHERE sound_id = ?;`,
            [sound_id]
        )
        return query[0][0]
    }

    async create ({
        sound_name, 
        sound_file_url, 
        sound_thumbnail_url, 
        user_id
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