import Producto from "../models/producto.js"

export async function getAllProducts (req, res){
    try {
        const allProduct = await Producto.findAll()
        res.status(200).json(allProduct)
    } catch (error) {
        res.status(204).json({ message: error })
    }
}

export async function getProdById (req, res){
     try {
        let prodId = parseInt(req.params.id)
        let prodEncontrado = await Producto.findByPk(prodId)
        if (!prodEncontrado) {            
            res.status(404).send('El producto con el id %s no existe', prodId)
        } else {
            res.json(prodEncontrado)
        }
    } catch (error) {
        res.status(204).json({ message: 'error' })
    }
}

export async function saveProd (req, res){
    if (req.nivelUsuario !== 1){
        return res.status(403).json({"message" : "No tiene permisos de administrador o proveedor para crear el producto"})
     }
     const codigo = req.body.codigo
    try {
        const codigoProducto = await Producto.findOne({where : {codigo}})
        if(!codigoProducto){
            const prodAGuardar = new Producto(req.body)
            await prodAGuardar.save()
            res.status(201).json({ message: 'Producto nuevo creado' })

        }else{
            res.status(400).json({ message: 'El código del producto ya existe' })
        }

      } catch (error) {
        res.status(204).json({ message: 'error' })
      }
}

export async function editProd (req, res){
    if (req.nivelUsuario !== 1){
        return res.status(403).json({"message" : "No tiene permisos de administrador o proveedor para modificar el producto"})
     }
    let idProdUpdate = parseInt(req.params.id)
    try {
        let prodUpdate = await Producto.findByPk(idProdUpdate)
        if (!prodUpdate) {
            return res.status(204).json({ message: ' Producto no encontrado ' })
        }
        await prodUpdate.update(req.body)
        res.status(200).send('Producto actualizado')
    } catch (error) {        
        res.status(204).json({ message: 'Producto no encontrado' })
    }
}

export async function deleteProd (req, res){
    if (req.nivelUsuario !== 1){
       return res.status(403).json({"message" : "No tiene permisos de administrador para borrar el producto"})
    }
        let idProdDelete = parseInt(req.params.id)
        try{
            let prodDelete = await Producto.findByPk(idProdDelete)
            if(!prodDelete){
                return res.status(204).json({"message": "No se pudo borrar el producto"})
            }
            await prodDelete.destroy()
            res.status(200).json({"message": "Producto borrado correctamente"})
        } catch (error){
            res.status(204).json({"message" : error})
        }
    
    
}

export async function updateStockByProveedor (req, res){
    if(req.nivelUsuario != 3){
        return res.status(400).json( "Permisos denegados, debe ser proveedor")
    }    
    
    try{
        const { sku, stock } = req.body
        const producto = await Producto.findOne({where : {codigo : sku}})
        if(!producto){
            res.status(400).json( { message: 'El producto no existe' })
        }        
        if(producto){
            producto.stock = stock
            await producto.save()
            res.status(200).json( { message: 'El stock del producto ha sido actualizado ' , producto })
        }
    }catch(error){
        res.status(500).json("ERROR", error)
    }

}