import express, { json } from 'express' // require -> commonJS
import { corsMiddleware } from './middlewares/cors'
import { createRouter } from './routes/index'


export const createApp = ({ acceptedOrigins }: { acceptedOrigins: any }) => {
    const app = express()
    // Framework instance
    app.use(express.static('public'));
    app.use(json())
    app.use(corsMiddleware({acceptedOrigins}))
    app.disable('x-powered-by')

    app.get('/favicon.ico', (_req: any, res: any) => res.status(204)); // Ignore favicon
    app.use('/v1', createRouter())

    return app
}