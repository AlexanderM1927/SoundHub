import request from 'supertest'
import 'dotenv/config'
import { createApp } from '../app.js'
import { createConnection } from '../connection.js'
  
const connection = await createConnection({
    env: process.env
})

describe('Reproduce a song -> GET /v1/download/:type/:url', () => {
    test('Should respond with a 200 status code', async () => {
        const response = await request(createApp(
            {
                acceptedOrigins: ['*'],
                connection
            }
        )).get('/v1/download/video/1vteRJasX1A').send()
        expect(response.statusCode).toBe(200)
    })
    test('Should respond with content-type audio/mpeg', async () => {
        const response = await request(createApp(
            {
                acceptedOrigins: ['*'],
                connection
            }
        )).get('/v1/download/video/1vteRJasX1A').send()
        expect(response.header['content-type']).toEqual('audio/mpeg')
    })
})