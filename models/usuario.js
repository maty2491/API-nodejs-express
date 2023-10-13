import db from '../db/connection.js'
import { DataTypes } from 'sequelize'

const Usuario = db.define('Usuario', {
  dni: { type: DataTypes.STRING },
  nombre: { type: DataTypes.STRING },
  apellido: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  telefono: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING }
},
{
  timestamps: false,
  tableName: 'usuarios'
})

export default Usuario
