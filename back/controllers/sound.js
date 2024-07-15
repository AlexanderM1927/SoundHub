export class SoundController {
    constructor (soundModel, viewModel, youtubeService) {
        this.soundModel = soundModel
        this.viewModel = viewModel
        this.youtubeService = youtubeService
    }

    search = async (req, res) => {
        try {
            const name = req.params.name

            const results = await this.youtubeService.searchSound({ name })
            
            res.json({
              error: null,
              data: results
            })
        } catch (error) {
            res.status(400).json({error: error.message})
        }
    }

    download = async (req, res) => {
        try {
            const url = req.params.url;
            const type = req.params.type;
            const userAgent = req.headers['user-agent'];
          
            res.setHeader("Content-Type", "audio/mpeg");
          
            const response = await this.youtubeService.downloadSound({ url, type, userAgent })

            if (response) {
                response.pipe(res)
            
                const data = {
                sound_id: url,
                view_type: type
                }
                await this.viewModel.createView(data)
            }
        } catch (e) {
            console.log(e);
        }  
    }

    getSoundById = async (req, res) => {
        try {
            const type = req.params.type
            const sound_id = req.params.id
            let sound = null
            if (type === 'sound') {
                const soundFromDB = await this.soundModel.getSoundById({ sound_id })
                sound = {
                    type: 'sound'
                }
                Object.assign(sound, soundFromDB.dataValues)
            } else {
                const youtubeSearch = await this.youtubeService.getSoundByYoutubeAPI({
                    name: sound_id
                })
                sound = youtubeSearch.items[0]
            }
            res.json({
              error: null,
              data: sound
            })
          } catch (error) {
            console.log(error)
            res.status(400).json({error})
          }
    }
}