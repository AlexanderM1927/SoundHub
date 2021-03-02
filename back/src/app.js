// Dependences
require('dotenv').config()
// Globals
global.reqlib = require('app-root-path').require
// Constants
const express = require('express')
const bodyP   = require('body-parser')
const cors    = require('cors')
const app     = express()
const http    = require('http').Server(app)
const io      = require('socket.io')(http)

// Framework instance
app.use(express.static('public'));
app.use(bodyP.urlencoded({ extended: false }));
app.use(bodyP.json({limit: '50mb'}))
app.use(cors())

reqlib('./v1/routes/routes')(app)

///////////////////////
// Socket management //
///////////////////////
io.on('connection', function(socket){
    // console.log('a user connected')
    // console.log(socket.id)

    socket.on('disconnect', function(){
        // console.log('user disconnected')
        var rooms = io.sockets.adapter.rooms
        if (rooms) {
            for (var room in rooms) {
                socket.leave(room);
            }
        }
    })

    socket.on('sk-start-sesion', function(userId){
        // with rules for everyone except certain sockets (sender)
        socket.join(userId);
        room = io.sockets.adapter.rooms[userId];
        // socket.emit('sk-start-sesion-res', userId, room.length)
        io.to(userId).emit('sk-start-sesion-res', userId, room.length)
    })

    socket.on('sk-start-activity', function(userId, activity, oActivity = {}, times = {}){
        // with rules for everyone except certain sockets (sender)
        socket.broadcast.emit('sk-start-activity-res', userId, activity, oActivity, times)
    })

    socket.on('sk-stop-activity', function(userId, activity){
        // with rules for everyone except certain sockets (sender)
        socket.broadcast.emit('sk-stop-activity-res', userId, activity)
    })

    socket.on('sk-drop-lap', function(userId, activity){
        // with rules for everyone except certain sockets (sender)
        socket.broadcast.emit('sk-drop-lap-res', userId, activity)
    })

    socket.on('sk-finish-activity', function(userId, activity){
        // with rules for everyone except certain sockets (sender)
        socket.broadcast.emit('sk-finish-activity-res', userId, activity)
    })

    socket.on('sk-return-activity', function(userId, activity, oActivity, times){
        // with rules for everyone except certain sockets (sender)
        socket.broadcast.emit('sk-return-activity-res', userId, activity, oActivity, times)
    })

    socket.on('sk-share-activity', function(userId){
        // with rules for everyone except certain sockets (sender)
        socket.broadcast.emit('sk-share-activity-res', userId)
    })

    socket.on('sk-delete-activity', function(userId){
        // with rules for everyone except certain sockets (sender)
        socket.broadcast.emit('sk-delete-activity-res', userId)
    })
})

// Deploy
http.listen(process.env.PORT, function () {
    console.log('listening on *:' + process.env.PORT)
})