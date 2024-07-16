export class SoundModel {
    constructor ({ connection }) {
        this.connection = connection
    }

    async getSoundByName ({ sound_name }) {
        const query = await this.connection.query(
            `SELECT * FROM sounds WHERE sound_name LIKE ?;`,
            [`%${sound_name}%`]
        )
        return query
    } 

    async getSoundById ({ sound_id }) {
        const query = await this.connection.query(
            `SELECT * FROM sounds WHERE sound_id = ?;`,
            [sound_id]
        )
        return query[0][0]
    } 
}