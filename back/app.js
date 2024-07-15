import express, { json } from 'express' // require -> commonJS
import { corsMiddleware } from './middlewares/cors.js'
import { verifyToken } from './middlewares/verifyToken.js'
import { createRouter } from './routes/index.js'


export const createApp = ({ acceptedOrigins, connection }) => {
    const app = express()
    // Framework instance
    app.use(express.static('public'));
    app.use(json())
    app.use(corsMiddleware({acceptedOrigins}))
    app.disable('x-powered-by')


    app.use('/v1', createRouter({ verifyToken, connection }))

    return app
}