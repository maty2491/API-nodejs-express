import { Sequelize } from 'sequelize'

const db = new Sequelize('kiskmxtb', // nombre db
  'kiskmxtb', // nombre usuario
  'jsLlSLk7Vtx5Opwkxu3-JNb7J3QTk-cQ', // password

  {
    host: 'silly.db.elephantsql.com',
    dialect: 'postgres',
    logging: false
  })

export default db
