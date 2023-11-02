import express from 'express';
import authToken from '../middlewares/tokenAuth.js';
import { addToCart, viewCart } from '../controllers/cartController.js';

const carritoRouter = express.Router();

carritoRouter.post('/carrito/nuevo', authToken, addToCart);
carritoRouter.get('/carrito/vista/:id', authToken, viewCart);

export default carritoRouter