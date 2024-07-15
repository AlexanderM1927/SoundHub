export class SoundModel {
    constructor ({ connection }) {
        this.connection = connection
    }

    async getSoundByName ({ sound_name }) {
        return await this.connection.query(
            `SELECT * FROM sounds WHERE sound_name LIKE ?;`,
            [`%${sound_name}%`]
        )
    } 

    async getSoundById ({ sound_id }) {
        return await this.connection.query(
            `SELECT * FROM sounds WHERE sound_id = ?;`,
            [sound_id]
        )
    } 
}