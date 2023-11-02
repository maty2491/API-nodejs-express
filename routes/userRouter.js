import express from "express"
import authToken from "../middlewares/tokenAuth.js"
const userRouter = express.Router()
import { getAllUsers, getUserById, saveUser, editUser, newProveedor, deleteUser} from '../controllers/userController.js'

userRouter.patch('/usuarios/nuevoProveedor', authToken, newProveedor)
userRouter.get('/usuarios',authToken, getAllUsers)
userRouter.get('/usuarios/:id',authToken, getUserById)
userRouter.post('/usuarios/', saveUser)
userRouter.patch('/usuarios/:id', authToken, editUser)
userRouter.delete('/usuarios/:id', authToken, deleteUser)

export default userRouter