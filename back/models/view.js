import moment from 'moment'

export class ViewModel {
    constructor ({ connection, youtubeService }) {
        this.connection = connection
        this.youtubeService = youtubeService
    }

    async getViews () {
        const startDate = moment().startOf('week').format('YYYY-MM-DD')
        const endDate = moment().add(1, 'days').format('YYYY-MM-DD')
        const views = await this.connection.query(
            `SELECT sound_id, view_type, COUNT(sound_id) as count 
            FROM views 
            WHERE createdAt BETWEEN ? AND ?
            GROUP BY sound_id, view_type
            ORDER BY count DESC;`,
            [startDate, endDate]
        )
        const results = {
            items: [],
            nextPage: {}
        }
        const viewsObj = views[0] 
        for (let i = 0; i < viewsObj.length; i++) {
            const obj = viewsObj[i]
            let sound = null
            if (obj.view_type === 'video') {
                const youtubeSearch = await this.youtubeService.getSoundByYoutubeAPI({ name: obj.sound_id })
                sound = youtubeSearch.items[0]
            } else {
                //TODO: Refactor this
                // const soundFromDB = await Sound.findOne({ 
                //     where: {
                //         sound_id: obj.sound_id
                //     },
                //     include: [{
                //         model: User
                //     }]
                // })
                // sound = {
                //     type: 'sound'
                // }
                // Object.assign(sound, soundFromDB.dataValues)
            }
            results.items.push(sound)
        }

        return results
    }

    async createView ({sound_id, view_type}) {
        await this.connection.query(
            `INSERT INTO views (sound_id, view_type, createdAt, updatedAt)
              VALUES (?, ?, ?, ?);`,
            [
                sound_id, 
                view_type, 
                moment().format('YYYY-MM-DD HH:mm:ss'), 
                moment().format('YYYY-MM-DD HH:mm:ss')
            ]
        )

    }
}