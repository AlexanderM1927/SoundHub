export class CommentController {
    commentRepository: any
    constructor (commentRepository: any) {
        this.commentRepository = commentRepository
    }

    store = async (req: any, res: any) => {
        const result = req.body
    
        try {
            const savedComment = await this.commentRepository.create(result)
            res.json({
                error: null,
                data: savedComment
            })
        } catch (error) {
            res.status(400).json({error: (error as Error).message})
        }
    }

    getCommentsBySoundId = async (req: any, res: any) => {
        try {
            const sound_id = req.params.sound_id

            const comments = await this.commentRepository.getCommentsBySoundId({ sound_id })
            
            res.json({
              error: null,
              data: comments
            })
        } catch (error) {
            res.status(400).json({error: (error as Error).message})
        }
    }
}