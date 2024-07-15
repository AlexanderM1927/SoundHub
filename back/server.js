import mysql from 'mysql2/promise'
import 'dotenv/config'
import { Server } from 'socket.io'
import { createApp } from './app.js'

const DEFAULT_CONFIG = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  }
  
const connection = await mysql.createConnection(DEFAULT_CONFIG)

const app = createApp({
    acceptedOrigins: [process.env.FRONT_URL],
    connection
})

const PORT = process.env.PORT ?? 1234

const server = app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
})

const io = new Server(server, {
    cors: {
        origin: [process.env.FRONT_URL]
    }
})
io.on('connect', (socket) => {
  socket.on('message', (data) => {
      console.log(data)
      io.sockets.emit('message', data)
  })
})