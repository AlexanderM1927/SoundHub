export class ViewController {
    constructor (viewModel) {
        this.viewModel = viewModel
    }

    getViews = async (req, res) => {
        try {
            const results = await this.viewModel.getViews()
            res.json({
                error: null,
                data: results
            })
        } catch (error) {
            res.status(400).json({error: error.message})
        }
        
    }
}