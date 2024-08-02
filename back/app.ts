import 'dotenv/config.js'
import express, { json } from 'express' // require -> commonJS
import { corsMiddleware } from './middlewares/cors'
import { createRouter } from './routes/index'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


export const createApp = ({ acceptedOrigins }: { acceptedOrigins: any }) => {
    const app = express()
    // Framework instance
    app.use(express.static('public'));
    app.use(json())
    app.use(corsMiddleware({acceptedOrigins}))
    app.use(cookieParser())
    app.disable('x-powered-by')

    app.get('/favicon.ico', (_req: any, res: any) => res.status(204)); // Ignore favicon
    app.use('/v1', createRouter())
    app.get("/*", (_req: any, res: any) => {
      const indexRoute = process.env.NODE_ENV === 'production' ? '../public/index.html' : 'public/index.html'
      res.sendFile(path.resolve(__dirname, indexRoute), function (err: any) {
        if (err) {
          res.status(500).send(err)
        }
      })
    });

    return app
}