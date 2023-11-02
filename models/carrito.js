import db from '../db/connection.js'
import { DataTypes } from 'sequelize'
import Producto from './producto.js';

const Carro =  db.define('carrito',
{
    id: { type: DataTypes.INTEGER, primaryKey : true, autoIncrement : true,  },
    sku: { type: DataTypes.STRING },
    cantidad: { type: DataTypes.INTEGER },
    id_user: { type: DataTypes.INTEGER }
},
{
    tableName: 'carrito',
    timestamps: false
  }
)

Carro.hasOne(Producto, { foreignKey: 'codigo', targetKey: 'sku'})
export default Carro



