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

    init ({connection}: {connection: any}) {
        const viewRepository = new ViewRepository(
            {
                connection,
                youtubeService: new YoutubeService(new SoundRepository({connection}))
            }
        )
        const userController = new UserController(new UserRepository({connection}))
        const viewController = new ViewController(viewRepository)
        const soundController = new SoundController(
            new SoundRepository({connection}),
            viewRepository,
            new YoutubeService(new SoundRepository({connection})),
            new UserRepository({connection}),
            new PlaylistRepository({connection})
        )
        const playlistController = new PlaylistController(new PlaylistRepository({connection}))
        const commentController = new CommentController(new CommentRepository({connection}))
        const soundPlaylistController = new SoundPlaylistController(
            new SoundPlaylistRepository({connection}),
            new YoutubeService(new SoundRepository({connection}))
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