import db from '../db/connection.js'
import { DataTypes } from 'sequelize'

const Producto = db.define('producto',
  {
    codigo: { type: DataTypes.STRING, allowNull : false, unique : true },
    nombre: { type: DataTypes.STRING },
    tipo: { type: DataTypes.STRING },
    precio: { type: DataTypes.DOUBLE },
    stock: { type: DataTypes.INTEGER }
  },
  {
    tableName: 'productos',
    timestamps: false
  }
)
await Producto.sync()

export default Producto
