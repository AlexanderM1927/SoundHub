import 'dotenv/config'
import { Server } from 'socket.io'
import { createApp } from './app'

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