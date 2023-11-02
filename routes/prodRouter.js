import express from "express"
import authToken from "../middlewares/tokenAuth.js"
const prodRouter = express.Router()
import { getAllProducts, getProdById, saveProd, editProd, deleteProd, updateStockByProveedor} from '../controllers/prodController.js'

prodRouter.patch('/productos/actualizar-stock', authToken, updateStockByProveedor)
prodRouter.get('/productos', getAllProducts)
prodRouter.get('/productos/:id', getProdById)
prodRouter.post('/productos', authToken, saveProd)
prodRouter.patch('/productos/:id', authToken, editProd)
prodRouter.delete('/productos/:id', authToken, deleteProd)

export default prodRouter
