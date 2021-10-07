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
const passport          		= require('passport')
const facebookStrategy  		= require('passport-facebook').Strategy
const session 					= require("express-session")
/* 
METHODS
All methods are define below this
*/

// Exportamos la configuración
module.exports = function (app) {
	app.use(session({secret: process.env.TOKEN_SECRET}))
	app.use(passport.initialize())
	app.use(passport.session())

	/* FACEBOOK */

	passport.use(new facebookStrategy({

		// pull in our app id and secret from our auth.js file
		clientID        : '160335866217337',
		clientSecret    : '197dddc1eeb091c2b5e82432115609ee',
		callbackURL     : process.env.APP_URL + 'facebook/callback',
		profileFields   : ['id','displayName','name','email']

	}, function(token, refreshToken, profile, done) {

		const data = {
			user_name: profile.name.givenName + ' ' + profile.name.familyName,
			user_email: profile.emails[0].value,
			password: process.env.TOKEN_SECRET
		}
		const login = UserController.authFacebook(data, callback)
		if (login) {
			return done(null, login)
		}
	}))

	passport.serializeUser(function(user, done) {
		done(null, user);
	})

	// used to deserialize the user
	passport.deserializeUser(function(id, done) {
		return done(null,user)
	})

	/* END FACEBOOK  */

	// Users
	app.post('/v1/login', UserController.login)
	app.post('/v1/register', UserController.register)
	app.post('/v1/setrank', verifyToken, UserController.setRank)
	app.get('/v1/user/:id', UserController.getUserById) 
	app.put('/v1/user/:id', verifyToken, UserController.update)

	// Facebook
	app.get('/v1/auth/facebook', passport.authenticate('facebook', { scope : 'email' }))
	app.get('/v1/facebook/callback', passport.authenticate('facebook', {session: false}, (req, res) => {
		const user = req.user
		const token = jwt.sign({
			name: user.user_name,
			id: user.user_id
		}, process.env.TOKEN_SECRET)

		location.href = process.env.FRONT_URL + 'facebook/' + token + '/' + JSON.stringify(user)
	}))

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
	app.get('/v1/playlists-user/:user_id', PlaylistController.showByUser)
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