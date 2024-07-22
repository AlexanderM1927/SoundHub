import express, { json } from 'express' // require -> commonJS
import { corsMiddleware } from './middlewares/cors'
import { verifyToken } from './middlewares/verifyToken'
import { createRouter } from './routes/index'


export const createApp = ({ acceptedOrigins, connection }: { acceptedOrigins: any, connection: any }) => {
    const app = express()
    // Framework instance
    app.use(express.static('public'));
    app.use(json())
    app.use(corsMiddleware({acceptedOrigins}))
    app.disable('x-powered-by')

    app.use('/v1', createRouter({ verifyToken, connection }))

    return app
}