import { Router } from 'express'
import { AppProvider } from '../providers/app'

export const createRouter = ({ verifyToken, connection }: { verifyToken: any, connection: any}) => {
    const router = Router()
	const {
		userController,
		viewController,
		soundController,
		playlistController,
		commentController,
		soundPlaylistController
	} = new AppProvider().init({connection})

    // Users
	router.post('/login', userController.login)
	router.post('/register', userController.register)
	router.post('/setrank', verifyToken, userController.setRank)
	router.get('/user/:id', userController.getUserById) 
	router.put('/user/:id', verifyToken, userController.update)

    // // Searches
	router.get('/search/:name', soundController.search)
	router.get('/download/:type/:url', soundController.download)
    
    // // Sounds
    router.post('/sounds', verifyToken, soundController.store)
    router.get('/sounds/:user_id', soundController.showByUser)
    // router.put('/sounds/:sound_id', verifyToken, soundController.update)
    // router.delete('/sounds/:sound_id', verifyToken, soundController.delete)
    router.get('/sounds_id/:type/:id', soundController.getSoundById)

    // // Playlist
	router.post('/playlists', verifyToken, playlistController.store)
	router.get('/playlists/:playlist_id', soundPlaylistController.get)
	router.get('/playlists-user/:user_id', playlistController.showByUser)
	// router.put('/playlists/:playlist_id', verifyToken, playlistController.update)

	// // Comments
	router.post('/comments', verifyToken, commentController.store)
	router.get('/comments/:sound_id', commentController.getCommentsBySoundId)

	// // Views
	router.get('/views', viewController.getViews)

	// SoundPlaylist
	router.post('/sound-playlist', verifyToken, soundPlaylistController.store)
	// router.delete('/sound-playlist/:sound_playlist_id', verifyToken, soundPlaylistController.delete)
    
    return router
}
