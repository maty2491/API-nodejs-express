import Carro from "../models/carrito.js"
import Producto from "../models/producto.js";

export async function addToCart(req, res) {
    if(req.nivelUsuario != 2 ){
        res.status(400).json({ message: 'Usted no tiene permisos' });
    }
    const { sku, cantidad } = req.body    
    // console.log("log de sub:", req.nivelUsuario)

    const idCliente = req.user
    console.log(req.user)
    console.log(idCliente)
    try {       
        const existe = await Producto.findOne({ where: {codigo: sku}})
        
        if(!existe){

            res.status(400).json({ message: 'El producto no existe' });
        }
        if(existe.stock < cantidad ){
            res.status(400).json({ message: 'El producto no tiene stock suficiente' });
        }

         existe.stock -= cantidad
        await existe.save()
        const nuevoCarrito = await Carro.create({ sku, cantidad, id_user: idCliente })

        res.status(200).json(nuevoCarrito)
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar el producto al carrito', error: error.message });
    }
}

export async function viewCart(req, res) {
    if(req.nivelUsuario != 2 ){
        res.status(400).json({ message: 'Usted no tiene permisos' });
    }
    try {
        const carrito = req.params.id
        const vistaCarrito = await Carro.findByPk(carrito 
            )
        res.status(200).json(vistaCarrito)
        
    } catch (error) {
        res.status(500).json({ message: 'Error al ver el carrito', error: error.message });
    }
}