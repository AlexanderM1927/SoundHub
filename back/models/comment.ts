import moment from 'moment'
export class CommentModel {
    connection: any
    constructor ({ connection }: {connection: any}) {
        this.connection = connection
    }
    async getCommentsBySoundId ({ sound_id }:{ sound_id: any }) {
        const query = await this.connection.query(
            `SELECT * FROM comments WHERE sound_id = ?
            ORDER BY comment_id DESC;`,
            [sound_id]
        )

        return query[0][0]
    }

    async create ({
        user_id,
        comment
    }: {
        user_id: Number,
        comment: String
    }) {
        try {
            await this.connection.query(
              `INSERT INTO comments (
                user_id, 
                comment_msg, 
                createdAt, 
                updatedAt)
                VALUES (?, ?, ?, ?);`,
                [
                    user_id, 
                    comment, 
                    moment().format('YYYY-MM-DD HH:mm:ss'), 
                    moment().format('YYYY-MM-DD HH:mm:ss')
                ]
            )

            return {
                comment_msg: comment,
                user_id
            }
        } catch (e) {
            console.log(e)
            throw new Error('Error creating comment')
        }
    }
}