import moment from 'moment'
import { Op, Sequelize } from 'sequelize'
// @ts-ignore
import { view as View, sound as Sound, user as User } from '../models'

export class ViewRepository {
    youtubeService
    constructor ({ youtubeService }: { youtubeService: any }) {
        
        this.youtubeService = youtubeService
    }

    async getViews () {
        const startDate = moment().startOf('week').format('YYYY-MM-DD')
        const endDate = moment().add(1, 'days').format('YYYY-MM-DD')
        const views = await View.findAll({
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
                const youtubeSearch = await this.youtubeService.getSoundByIdOnYoutube({ id: obj.sound_id })
                if (youtubeSearch && youtubeSearch.title) {
                    sound = youtubeSearch
                } else {
                    continue;
                }
            } else {
                const soundFromDB = await Sound.findOne({ 
                    where: {
                        sound_id: obj.sound_id
                    },
                    include: [{
                        model: User
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

    async create ({sound_id, view_type}: {sound_id: any, view_type: any}) {
        const view = new View({
            sound_id,
            view_type
        })
        await view.save()

    }
}