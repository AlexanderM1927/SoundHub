export class CommentController {
    constructor (commentModel) {
        this.commentModel = commentModel
    }

    store = async (req, res) => {

    }

    getCommentsBySoundId = async (req, res) => {
        try {
            const sound_id = req.params.sound_id

            const comments = await this.commentModel.getCommentsBySoundId({ sound_id })
            
            res.json({
              error: null,
              data: comments
            })
        } catch (error) {
            res.status(400).json({error: error.message})
        }
    }
}