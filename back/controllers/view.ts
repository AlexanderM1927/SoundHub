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
}