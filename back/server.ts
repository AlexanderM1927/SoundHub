import 'dotenv/config'
import { Server } from 'socket.io'
import { createApp } from './app'
// @ts-ignore
import db from './models'

db.sequelize.sync();

// db.sequelize.sync({force: true}).then(() => {
//     console.log('Drop and Resync Db')
//     initial()
// });

// function initial() {
//     db.role.create({
//         role_id: 1,
//         role_name: "user"
//     });

//     db.role.create({
//         role_id: 2,
//         role_name: "moderator"
//     });

//     db.role.create({
//         role_id: 3,
//         role_name: "admin"
//     });
// }

const app = createApp({
    acceptedOrigins: [
        process.env.FRONT_URL,
        'http://localhost:5173' // for tailwind
    ]
})

const PORT = process.env.PORT ?? 1234

const server = app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`)
})

const io = new Server(server, {
    cors: {
        origin: [process.env.FRONT_URL as string]
    }
})
io.on('connect', (socket) => {
  socket.on('message', (data) => {
      io.sockets.emit('message', data)
  })
})