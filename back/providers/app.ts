import { UserController } from '../controllers/user'
import { SoundController } from '../controllers/sound'
import { PlaylistController } from '../controllers/playlist'
import { CommentController } from '../controllers/comment'
import { ViewController } from '../controllers/view'
import { UserModel } from '../models/user'
import { ViewModel } from '../models/view'
import { SoundModel } from '../models/sound'
import { PlaylistModel } from '../models/playlist'
import { CommentModel } from '../models/comment'
import { YoutubeService } from '../services/youtube'
import { IAppProvider } from '../types/types'

export class AppProvider implements IAppProvider {
    userController: any
    viewController: any
    soundController: any
    playlistController: any
    commentController: any


    constructor ({connection}: {connection: any}) {

        return this.init({connection})
    }

    init ({connection}: {connection: any}): any {
        const viewModel = new ViewModel(
            {
                connection,
                youtubeService: new YoutubeService(new SoundModel({connection}))
            }
        )
        const userController = new UserController(new UserModel({connection}))
        const viewController = new ViewController(viewModel)
        const soundController = new SoundController(
            new SoundModel({connection}),
            viewModel,
            new YoutubeService(new SoundModel({connection}))
        )
        const playlistController = new PlaylistController(new PlaylistModel({connection}))
        const commentController = new CommentController(new CommentModel({connection}))

        return {
            userController,
            viewController,
            soundController,
            playlistController,
            commentController
        }
    }
}