'use strict'
// Llamamos al middlewares
// var md_auth = require('../../middlewares/authenticated');

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
}