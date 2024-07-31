// @ts-ignore
import { comment as Comment, user as User } from '../models'

export class CommentRepository {
    
    constructor () {
        
    }
    async getCommentsBySoundId ({ sound_id }:{ sound_id: any }) {
        const comments = await Comment.findAll({ 
            where: {
              sound_id
            },
            order: [
              ['comment_id', 'DESC']
            ],
            include: [{
              model: User
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
            const commentCreated = new Comment({
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