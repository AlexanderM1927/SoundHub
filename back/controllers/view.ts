export class ViewController {
    viewModel
    constructor (viewModel: any) {
        this.viewModel = viewModel
    }

    getViews = async (_req: any, res: any) => {
        try {
            const results = await this.viewModel.getViews()
            res.json({
                error: null,
                data: results
            })
        } catch (error) {
            res.status(400).json({error: (error as Error).message})
        }
        
    }
}