export class PlaylistController {
    playlistRepository: any
    constructor (playlistRepository: any) {
        this.playlistRepository = playlistRepository
    }

    store = async (req: any, res: any) => {
        const result = req.body
    
        try {
            const savedPlaylist = await this.playlistRepository.create(result)
            res.json({
                error: null,
                data: savedPlaylist
            })
        } catch (error) {
            res.status(400).json({error: (error as Error).message})
        }
    }

    showByUser = async (req: any, res: any) => {
        try {
            const user_id = parseInt(req.params.user_id)

            const results = await this.playlistRepository.getPlaylistByUserId({ user_id })
            
            res.json({
              error: null,
              data: results
            })
        } catch (error) {
            res.status(400).json({error: (error as Error).message})
        }
    }
}