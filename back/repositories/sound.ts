import { Op } from 'sequelize'
// @ts-ignore
import { sound as Sound } from '../models'

export class SoundRepository {
    
    constructor () {
        
    }

    async getSoundByName ({ sound_name }: {sound_name: String}) {
        const sounds = await Sound.findAll({ 
            where: {
                user_name: {
                    [Op.like]: '%' + sound_name + '%'
                }
            }
        })

        return sounds
    } 

    async getSoundById ({ sound_id }: {sound_id: Number}) {
        const sound = await Sound.findOne({ 
            where: {
              sound_id
            }
        })

        return sound
    }

    async getSoundByUserId ({ user_id }: {user_id: Number}) {
        const sounds = await Sound.findAll({ 
            where: {
                user_id
            }
        })

        return sounds
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
            const sound = new Sound({
                user_id,
                sound_name,
                sound_file_url,
                sound_thumbnail_url
            });
            await sound.save()

            return sound
        } catch (e) {
            console.log(e)
            throw new Error('Error creating sound')
        }
    }
}