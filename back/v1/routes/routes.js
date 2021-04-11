'use strict'
// Llamamos al middlewares
var verifyToken = reqlib('/v1/routes/verifyToken');

// Controllers
const UserController 	= reqlib('/v1/controllers/userController.js');
const SearchController 	= reqlib('/v1/controllers/searchController.js');
const SoundController 	= reqlib('/v1/controllers/soundController.js');
const PlaylistController 	= reqlib('/v1/controllers/playlistController.js');
const SoundPlaylistController 	= reqlib('/v1/controllers/soundPlaylistController.js');

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

	// Playlist
	app.post('/v1/playlists', verifyToken, PlaylistController.store)
	app.get('/v1/playlists/:playlist_id', PlaylistController.get)
	app.get('/v1/playlists-user/:user_id', verifyToken, PlaylistController.showByUser)
	app.put('/v1/playlists/:playlist_id', verifyToken, PlaylistController.update)

	// SoundPlaylist
	app.post('/v1/sound-playlist', verifyToken, SoundPlaylistController.store)
}