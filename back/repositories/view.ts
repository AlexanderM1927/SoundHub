import moment from 'moment'
import { Op, Sequelize } from 'sequelize'
// @ts-ignore
import db from '../models'

export class ViewRepository {
    youtubeService
    constructor ({ youtubeService }: { youtubeService: any }) {
        
        this.youtubeService = youtubeService
    }

    async getViews () {
        const startDate = moment().startOf('week').format('YYYY-MM-DD')
        const endDate = moment().add(1, 'days').format('YYYY-MM-DD')
        const views = await db.view.findAll({
            attributes: [
                'sound_id',
                'view_type',
                [Sequelize.literal('COUNT(sound_id)'), 'count']
            ],
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            },
            group: ['sound_id', 'view_type'],
            order: [
                [Sequelize.literal('count'), 'DESC']
            ],
            limit: 10
        })
        const results: {
            items: any[],
            nextPage: any
        } = {
            items: [],
            nextPage: {}
        }
        for (let i = 0; i < views.length; i++) {
            const obj = views[i]
            let sound = null
            if (obj.view_type === 'video') {
                const youtubeSearch = await this.youtubeService.getSoundByYoutubeAPI({ name: obj.sound_id })
                sound = youtubeSearch.items[0]
            } else {
                const soundFromDB = await db.sound.findOne({ 
                    where: {
                        sound_id: obj.sound_id
                    },
                    include: [{
                        model: db.user
                    }]
                })
                sound = {
                    type: 'sound'
                }
                Object.assign(sound, soundFromDB.dataValues)
            }
            if (sound) results.items.push(sound)
        }

        return results
    }

    async createView ({sound_id, view_type}: {sound_id: any, view_type: any}) {
        const view = new db.view({
            sound_id,
            view_type
        })
        await view.save()

    }
}