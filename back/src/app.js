// Dependences
require('dotenv').config()
// Globals
global.reqlib = require('app-root-path').require
// Constants
const express           = require('express')
const bodyP             = require('body-parser')
const cors              = require('cors')
const app               = express()
const http              = require('http')
const server            = http.createServer(app)
const db                = require('../v1/models')
const Role              = db.role
const { Server }        = require('socket.io')
app.use(express.static(__dirname+'/public'));

db.sequelize.sync();

//db.sequelize.sync({force: true}).then(() => {
//console.log('Drop and Resync Db')
//initial()
//});

function initial() {
    Role.create({
        role_id: 1,
        role_name: "user"
    });

    Role.create({
        role_id: 2,
        role_name: "moderator"
    });

    Role.create({
        role_id: 3,
        role_name: "admin"
    });
}

// Framework instance
app.use(express.static('public'));
app.use(bodyP.urlencoded({ extended: false }));
app.use(bodyP.json({limit: '50mb'}))
app.use(cors())

require('../v1/routes/routes')(app)

const io = new Server(server, {
    cors: {
        origin: '*',
    }
})
io.on('connect', (socket) => {
    socket.on('message', (data) => {
        console.log(data)
        io.sockets.emit('message', data)
    })
})

// Deploy
server.listen(process.env.PORT, function () {
    console.log('listening on *:' + process.env.PORT)
})