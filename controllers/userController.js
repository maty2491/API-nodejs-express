import Usuario from "../models/usuario.js"

export async function getAllUsers (req, res){
    if(req.nivelUsuario != 1 ){
        res.status(400).json({ message: 'Usted no tiene permisos' });
    }
    try {
        const allUsers = await Usuario.findAll()
        res.status(200).json(allUsers)
    } catch (error) {
        res.status(204).json({ message: error })
    }
}

export async function getUserById (req, res){
    if(req.nivelUsuario != 1 ){
        res.status(400).json({ message: 'Usted no tiene permisos' });
    }
    try {
        let userId = parseInt(req.params.id)
        let userEncontrado = await Usuario.findByPk(userId)
        if (!userEncontrado) {
            console.log('El usuario con el id %s no existe', userId)
            res.status(404).send('El usuario con el id %s no existe', userId)
        } else {
            res.json(userEncontrado)
        }
    } catch (error) {
        res.status(204).json({ message: 'error' })
    }
}

export async function saveUser (req, res){ 

    try {
        const { dni, nombre, apellido, email, telefono, password } = req.body

        const usuarioAGuardar = new Usuario({ 
            dni,
            nombre,
            apellido,
            email,
            telefono,
            password,
            id_rol : 2,
        })
        
        await usuarioAGuardar.save()
        res.status(201).json({ message: 'Usuario creado con exito' })
      } catch (error) {
        res.status(500).json({ message: 'error', error })
      }
}

export async function editUser (req, res) {
    if (req.nivelUsuario !== 1){
        return res.status(403).json({"message" : "No tiene permisos de administrador para modificar el usuario"})
     }
    let idUserUpdate = parseInt(req.params.id)
    try {
        let userUpdate = await Usuario.findByPk(idUserUpdate)
        if (!userUpdate) {
            return res.status(204).json({ message: ' Usuario no encontrado ' })
        }
        await userUpdate.update(req.body)
        res.status(200).send('Usuario actualizado')
    } catch (error) {
        console.log(error);
        res.status(204).json({ message: 'Usuario no encontrado' })
    }
}

export async function deleteUser (req, res){
    if (req.nivelUsuario !== 1){
        return res.status(403).json({"message" : "No tiene permisos de administrador para borrar el usuario"})
     }
    let idUserDelete = parseInt(req.params.id)
    try {
        let userDelete = await Usuario.findByPk(idUserDelete)

        if (!userDelete) {
            res.status(204).json({ message: 'Usuario no encontrado' })
        }

        await userDelete.destroy()
        res.status(200).json({ message: 'Usuario borrado' })
    } catch (error) {
        res.status(204).json({ message: 'Error' })
    }
}

export async function newProveedor (req, res){
    if(req.nivelUsuario != 1){
        return res.status(400).json( "Permisos denegados, debe ser admin")
    }    
    const usuario = req.body.id
    try{
        const proveedor = await Usuario.findByPk(parseInt(usuario))
        if(!proveedor){
            res.status(400).json( { message: 'El usuario no existe' })
        }
        if(proveedor.id_rol === 3 ){
            res.status(201).json( { message: 'El usuario ya es proveedor' })
        }
        if(proveedor.id_rol != 3){
            proveedor.id_rol = 3
            await proveedor.save()
            res.status(200).json( { message: 'El proveedor ha sido creado ' , proveedor })
        }
    }catch(error){
        res.status(500).json("ERROR", error)
    }

}