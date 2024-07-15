import mysql from 'mysql2/promise'

export const createConnection = async ({
    env
}) => {
    const DEFAULT_CONFIG = {
        host: env.DB_HOST,
        user: env.DB_USERNAME,
        port: env.DB_PORT,
        password: env.DB_PASSWORD,
        database: env.DB_DATABASE
    }
      
    return await mysql.createConnection(DEFAULT_CONFIG)
}