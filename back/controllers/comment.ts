export class CommentController {
    commentModel: any
    constructor (commentModel: any) {
        this.commentModel = commentModel
    }

    store = async (_req: any, _res: any) => {

    }

    getCommentsBySoundId = async (req: any, res: any) => {
        try {
            const sound_id = req.params.sound_id

            const comments = await this.commentModel.getCommentsBySoundId({ sound_id })
            
            res.json({
              error: null,
              data: comments
            })
        } catch (error) {
            res.status(400).json({error: (error as Error).message})
        }
    }
}