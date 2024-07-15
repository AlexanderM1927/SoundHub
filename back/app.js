import express, { json } from 'express' // require -> commonJS
import { corsMiddleware } from './middlewares/cors.js'
import { verifyToken } from './middlewares/verifyToken.js'
import { createRouter } from './routes/index.js'
import mysql from 'mysql2/promise'
import 'dotenv/config'
import { Server } from 'socket.io'

const app = express()
// Framework instance
app.use(express.static('public'));
app.use(json())
app.use(corsMiddleware({
  acceptedOrigins: [process.env.FRONT_URL]
}))
app.disable('x-powered-by')


const DEFAULT_CONFIG = {
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
}

const connection = await mysql.createConnection(DEFAULT_CONFIG)

app.use('/v1', createRouter({ verifyToken, connection }))

const PORT = process.env.PORT ?? 1234

const server = app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
})

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