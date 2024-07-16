export class CommentModel {
    constructor ({ connection }) {
        this.connection = connection
    }
    async getCommentsBySoundId ({ sound_id }) {
        const query = await this.connection.query(
            `SELECT * FROM comments WHERE sound_id = ?
            ORDER BY comment_id DESC;`,
            [sound_id]
        )

        return query[0][0]
    }
}