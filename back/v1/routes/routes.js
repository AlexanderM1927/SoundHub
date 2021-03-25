'use strict'
// Llamamos al middlewares
var verifyToken = require('/v1/routes/verifyToken');

// Controllers
const UserController 	= reqlib('/v1/controllers/userController.js');

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
}