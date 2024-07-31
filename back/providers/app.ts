import { UserController } from '../controllers/user'
import { SoundController } from '../controllers/sound'
import { PlaylistController } from '../controllers/playlist'
import { SoundPlaylistController } from '../controllers/soundPlaylist'
import { CommentController } from '../controllers/comment'
import { ViewController } from '../controllers/view'
import { UserRepository } from '../repositories/user'
import { ViewRepository } from '../repositories/view'
import { SoundRepository } from '../repositories/sound'
import { PlaylistRepository } from '../repositories/playlist'
import { CommentRepository } from '../repositories/comment'
import { SoundPlaylistRepository } from '../repositories/soundPlaylist'
import { YoutubeService } from '../services/youtube'
import { IAppProvider } from '../types/types'

export class AppProvider implements IAppProvider {
    constructor () {}

    init () {
        const viewRepository = new ViewRepository(
            {
                youtubeService: new YoutubeService(new SoundRepository())
            }
        )
        const userController = new UserController(new UserRepository())
        const viewController = new ViewController(viewRepository)
        const soundController = new SoundController(
            new SoundRepository(),
            viewRepository,
            new YoutubeService(new SoundRepository()),
            new UserRepository(),
            new PlaylistRepository()
        )
        const playlistController = new PlaylistController(new PlaylistRepository())
        const commentController = new CommentController(new CommentRepository())
        const soundPlaylistController = new SoundPlaylistController(
            new SoundPlaylistRepository(),
            new YoutubeService(new SoundRepository())
        )

        return {
            userController,
            viewController,
            soundController,
            playlistController,
            commentController,
            soundPlaylistController
        }
    } 
}