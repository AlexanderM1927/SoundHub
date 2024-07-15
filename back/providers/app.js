import { UserController } from '../controllers/user.js'
import { SoundController } from '../controllers/sound.js'
import { PlaylistController } from '../controllers/playlist.js'
import { CommentController } from '../controllers/comment.js'
import { ViewController } from '../controllers/view.js'
import { UserModel } from '../models/user.js'
import { ViewModel } from '../models/view.js'
import { SoundModel } from '../models/sound.js'
import { PlaylistModel } from '../models/playlist.js'
import { CommentModel } from '../models/comment.js'
import { YoutubeService } from '../services/youtube.js'

export class AppProvider {
    constructor ({connection}) {

        return this.init({connection})
    }

    init ({connection}) {
        const userController = new UserController(new UserModel({connection}))
        const viewController = new ViewController(
            new ViewModel(
                {
                    connection,
                    youtubeService: new YoutubeService(new SoundModel({connection}))
                }
            )
        )
        const soundController = new SoundController(
            new SoundModel({connection}),
            new ViewModel(
                {
                    connection,
                    youtubeService: new YoutubeService(new SoundModel({connection}))
                }
            ),
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