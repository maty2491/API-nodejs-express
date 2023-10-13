import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const db = new Sequelize(
  process.env.DB_NAME, // nombre db
  process.env.DB_USERNAME, // nombre usuario
  process.env.DB_PASSWORD, // password

  {
    host: process.env.DB_HOSTNAME,
    dialect: process.env.DB_DIALECT,
    logging: false
  })

export default db
