import 'dotenv/config.js'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __filename y __dirname no están disponibles en módulos ES6, así que se necesita definirlos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
import { Dialect, Sequelize } from 'sequelize'
// @ts-ignore
import config from '../config/config.js'

const sequelize = new Sequelize(
  config[process.env.NODE_ENV].database as string,
  config[process.env.NODE_ENV].username as string,
  config[process.env.NODE_ENV].password as string,
  {
    host: config[process.env.NODE_ENV].host,
    port: parseInt(config[process.env.NODE_ENV].port as string),
    dialect: config[process.env.NODE_ENV].dialect as Dialect,
    pool: {
      max: config[process.env.NODE_ENV].pool.max,
      min: config[process.env.NODE_ENV].pool.min,
      acquire: config[process.env.NODE_ENV].pool.acquire,
      idle: config[process.env.NODE_ENV].pool.idle
    }
  }
);
const db: any = (async () => {
  const db: any = {}
  const files = fs.readdirSync(__dirname)
    .filter(file => {
      return (
        file.indexOf('.') !== 0 &&
        file !== basename &&
        file.slice(-3) === '.ts' &&
        file.indexOf('.test.ts') === -1
      )
    })

  for await (const file of files) {
    const model = await import(path.join(__dirname, file))
    const namedModel = model.default(sequelize, (Sequelize as any).DataTypes)
    db[namedModel.name] = namedModel
  }

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db)
    }
  });

  db.sequelize = sequelize
  db.Sequelize = Sequelize
    
  return db;
})()

export const { 
  user, 
  role, 
  ban, 
  sound, 
  playlist, 
  comment, 
  like, 
  favorite, 
  view, 
  sounds_playlist 
} = await db;