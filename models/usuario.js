import db from '../db/connection.js'
import { DataTypes } from 'sequelize'

const Usuario = db.define('Usuario', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  dni: { type: DataTypes.STRING },
  nombre: { type: DataTypes.STRING },
  apellido: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  telefono: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING },
  id_rol: { type: DataTypes.STRING }
},
{
  timestamps: false,
  tableName: 'usuarios'
})

export default Usuario
