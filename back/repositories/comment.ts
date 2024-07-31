// @ts-ignore
import db from '../models'

export class CommentRepository {
    
    constructor () {
        
    }
    async getCommentsBySoundId ({ sound_id }:{ sound_id: any }) {
        const comments = await db.comment.findAll({ 
            where: {
              sound_id
            },
            order: [
              ['comment_id', 'DESC']
            ],
            include: [{
              model: db.user
            }]
          })
        
        return comments
    }

    async create ({
        user_id,
        comment,
        sound_id
    }: {
        sound_id: Number,
        user_id: Number,
        comment: String
    }) {
        try {
            const commentCreated = new db.comment({
                user_id,
                comment_msg: comment,
                sound_id
            })
            await commentCreated.save()

            return commentCreated
        } catch (e) {
            console.log(e)
            throw new Error('Error creating comment')
        }
    }
}