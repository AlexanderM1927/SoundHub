import moment from 'moment'
import { Op, Sequelize } from 'sequelize'
// @ts-ignore
import { view as View, sound as Sound, user as User } from '../models'

const getDisplayTitle = (item: any) => {
    return item?.sound_name || item?.title || item?.name || 'Sin título'
}

const getDisplayImage = (item: any) => {
    if (!item) return ''

    if (item.sound_thumbnail_url) return item.sound_thumbnail_url
    if (item.img) return item.img
    if (item.thumbnail?.thumbnails?.length > 0) {
        return item.thumbnail.thumbnails[0].url
    }

    return ''
}

export class ViewRepository {
    youtubeService
    constructor ({ youtubeService }: { youtubeService: any }) {
        
        this.youtubeService = youtubeService
    }

    async getViews () {
        const startDate = moment().startOf('week').format('YYYY-MM-DD')
        const endDate = moment().add(1, 'days').format('YYYY-MM-DD')
        let views = await View.findAll({
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

        if (views.length === 0) {
            views = await View.findAll({
                attributes: [
                    'sound_id',
                    'view_type',
                    [Sequelize.literal('COUNT(sound_id)'), 'count']
                ],
                group: ['sound_id', 'view_type'],
                order: [
                    [Sequelize.literal('count'), 'DESC']
                ],
                limit: 10
            })
        }
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
                const video = await this.youtubeService.getSoundByIdOnYoutube({ id: obj.sound_id })
                sound = video ? {
                    ...video,
                    title: getDisplayTitle(video),
                    display_title: getDisplayTitle(video),
                    img: getDisplayImage(video),
                    url: video.id,
                    type: 'video'
                } : null
                if (!sound || !sound.id) {
                    continue
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
                if (soundFromDB) {
                    const soundData = soundFromDB.dataValues || soundFromDB
                    sound = {
                        ...soundData,
                        type: 'sound',
                        title: getDisplayTitle(soundData),
                        display_title: getDisplayTitle(soundData),
                        sound_name: soundData.sound_name || soundData.title || '',
                        img: getDisplayImage(soundData),
                        url: soundData.sound_id
                    }
                }
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
