'use strict'
// Llamamos al middlewares
var verifyToken = reqlib('/v1/routes/verifyToken');

// Controllers
const UserController 			= reqlib('/v1/controllers/userController.js');
const SearchController 			= reqlib('/v1/controllers/searchController.js');
const SoundController 			= reqlib('/v1/controllers/soundController.js');
const PlaylistController 		= reqlib('/v1/controllers/playlistController.js');
const SoundPlaylistController 	= reqlib('/v1/controllers/soundPlaylistController.js');
const CommentController 		= reqlib('/v1/controllers/commentController.js');
const ViewController 			= reqlib('/v1/controllers/viewController.js');

/* 
METHODS
All methods are define below this
*/

// Exportamos la configuración
module.exports = function (app) {
	// Users
	app.post('/v1/login', UserController.login)
	app.post('/v1/register', UserController.register)
	app.post('/v1/setrank', verifyToken, UserController.setRank) //middleware route

	// Searches
	app.get('/v1/search/:name', SearchController.search)
	app.get('/v1/download/:type/:url', SearchController.download)

	// Sounds
	app.post('/v1/sounds', verifyToken, SoundController.store)
	app.get('/v1/sounds/:user_id', SoundController.showByUser)
	app.put('/v1/sounds/:sound_id', verifyToken, SoundController.update)
	app.delete('/v1/sounds/:sound_id', verifyToken, SoundController.delete)
	app.get('/v1/sounds_id/:type/:id', SoundController.getSoundById)

	// Playlist
	app.post('/v1/playlists', verifyToken, PlaylistController.store)
	app.get('/v1/playlists/:playlist_id', PlaylistController.get)
	app.get('/v1/playlists-user/:user_id', verifyToken, PlaylistController.showByUser)
	app.put('/v1/playlists/:playlist_id', verifyToken, PlaylistController.update)

	// Comments
	app.post('/v1/comments', verifyToken, CommentController.store)
	app.get('/v1/comments/:sound_id', CommentController.getCommentsBySoundId)

	// Views
	app.get('/v1/views', ViewController.getViews)

	// SoundPlaylist
	app.post('/v1/sound-playlist', verifyToken, SoundPlaylistController.store)
	app.delete('/v1/sound-playlist/:sound_playlist_id', verifyToken, SoundPlaylistController.delete)
}