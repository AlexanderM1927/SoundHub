export class ViewController {
    viewRepository
    constructor (viewRepository: any) {
        this.viewRepository = viewRepository
    }

    getViews = async (_req: any, res: any) => {
        try {
            const results = await this.viewRepository.getViews()
            res.json({
                error: null,
                data: results
            })
        } catch (error) {
            res.status(400).json({error: (error as Error).message})
        }
        
    }

    store = async (req: any, res: any) => {
        const result = req.body
    
        try {
            const view = await this.viewRepository.create(result)
            res.json({
                error: null,
                data: view
            })
        } catch (error) {
            res.status(400).json({error: (error as Error).message})
        }
    }
}