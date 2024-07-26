import 'dotenv/config'
import { Server } from 'socket.io'
import { createApp } from './app'
import { createConnection } from './connection'

const connection = await createConnection({
    env: process.env
})

const app = createApp({
    acceptedOrigins: [
        process.env.FRONT_URL,
        'http://localhost:5173'
    ],
    connection
})

const PORT = process.env.PORT ?? 1234

const server = app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
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