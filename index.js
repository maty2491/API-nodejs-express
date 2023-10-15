import { createRequire } from 'node:module'
import express from 'express'
import Producto from './models/producto.js'
import Usuario from './models/usuario.js'
import db from './db/connection.js'
import jwt from 'jsonwebtoken'

const app = express()

const expossedPort = 1234

const html = `
<h1>Bienvenido a la API</h1>
   <p>Los comandos disponibles son:</p>
       <ul>
          <li>GET: /productos/</li>
          <li>GET: /productos/id</li>
          <li>POST: /productos/</li>
          <li>DELETE: /productos/id</li>
          <li>PUT: /productos/id</li>
          <li>PATCH: /productos/id</li>
          <li>GET: /usuarios/</li>
          <li>GET: /usuarios/id</li>
          <li>POST: /usuarios/</li>
          <li>DELETE: /usuarios/id</li>
          <li>PUT: /usuarios/id</li>
          <li>PATCH: /usuarios/id</li>
      </ul>
`
app.use((req, res, next) => {
  if ((req.method !== 'POST') && (req.method !== 'PATCH')) { return next() }
  if (req.headers['content-type'] !== 'application/json') { return next() }
  let newUser = ''
  req.on('data', (chunk) => {
    newUser += chunk.toString()
  })
  req.on('end', () => {
    req.body = JSON.parse(newUser)
    next()
  })
})

function authToken (req, res, next) {
    const headerAuthorization = req.headers['authorization']
    const tokenRecibido = headerAuthorization.split(" ")[1]
    if (tokenRecibido == null) {
      return res.status(401).json({ message: 'Token inválido' })
    }
    let payload = null
    try {
      payload = jwt.verify(tokenRecibido, process.env.SECRET_KEY)
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido' })
    }
    if (Date.now() > payload.exp) {
      return res.status(401).json({ message: 'Token caducado' })
    }
    req.user = payload.sub
    console.log(req.user);
    next()
  }

app.get('/', (req, res) => {
  res.status(200).send(html)
})
// Endpoint validacion
app.post('/auth', async (req, res) => {
  const userToSearch = req.body.email
  const userPassReq = req.body.password
  let userFind = ''
  // Comprobar usuario
  try {
  userFind = await Usuario.findAll({ where: { email: userToSearch } })
    if (userFind == '') { return res.status(400).json({ message: "Usuario invalido "})}
  } catch (error) {
        return res.status(400).json({ message: 'Usuario no encontrado' })
    }
    // Comprobar password
    if (userFind[0].password !== userPassReq) {
        return res.status(400).json({ message: 'Password incorrecto' })
    }
    // Generar TOKEN
    const sub = userFind[0].id
    const user = userFind[0].email
    // Firma y construccion de TOKEN
    const token = jwt.sign({
        sub,
        user,
        exp: Date.now() + (300 * 1000)
    }, process.env.SECRET_KEY)
    res.status(200).json({ accessToken: token })
})

// 1. Crear el endpoint ‘/usuarios/’, que devuelva el listado completo de usuarios.

app.get('/usuarios', async (req, res) => {
    try {
        const allUsers = await Usuario.findAll()
        res.status(200).json(allUsers)
    } catch (error) {
        res.status(204).json({ message: error })
    }
})

app.get('/productos', async (req, res) => {
    try {
        const allProduct = await Producto.findAll()
        res.status(200).json(allProduct)
    } catch (error) {
        res.status(204).json({ message: error })
    }
})

// 2. Crear el endpoint ‘/usuarios/id’ que devuelva los datos de un usuario en particular consignado por su número de id.

app.get('/usuarios/:id', async (req, res) => {
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
})

// 3. Crear el endpoint ‘/usuarios/’ que permita guardar un nuevo usuario.

app.post('/usuarios/new', authToken, async (req, res) => {
  try {
    const usuarioAGuardar = new Usuario(req.body)
    console.log(usuarioAGuardar)
    await usuarioAGuardar.save()
    res.status(201).json({ message: 'Usuario creado' })
  } catch (error) {
    res.status(204).json({ message: 'error' })
  }
})

// 4. Crear el endpoint ‘/usuarios/id’ que permita modificar algún atributo de un usuario.

app.patch('/usuarios/:id', authToken, async (req, res) => {
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
})
// 5. Crear el endpoint ‘/usuarios/id’ que permita borrar un usuario de los datos.

app.delete('/usuarios/:id', async (req, res) => {
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
})

// 6. Crear el endpoint que permita obtener el precio de un producto que se indica por id.

app.get('/productos/:id/precio', async (req, res) => {
    const idProduct = parseInt(req.params.id)
    const productExist = await Producto.findByPk(idProduct)

    if (productExist) {
        res.status(200).json({ 'El precio del producto es ': productExist.precio })
    } else {
        res.status(404).json({ message: 'El producto no existe' })
    }
})

// 7. Crear el endpoint que permita obtener el nombre de un producto que se indica por id.

app.get('/productos/:id/nombre', async (req, res) => {
    const idProduct = parseInt(req.params.id)
    const productExist = await Producto.findByPk(idProduct)

    if (productExist) {
        res.status(200).json({ 'El nombre del producto es ': productExist.nombre })
    } else {
        res.status(404).json({ message: 'El producto no existe' })
    }
})

// 8. Crear el endpoint que permita obtener el teléfono de un usuario que se indica por id.

app.get('/usuarios/:id/telefono', async (req, res) => {
    try {
        let idUser = parseInt(req.params.id)
        let userExist = await Usuario.findByPk(idUser)
        if (!userExist) {
            res.status(204).json({ message: 'El usuario no fue encontrado' })
        }
        res.status(200).json({ 'El telefono del usuario es:': userExist.telefono })
    } catch (err) {
        res.status(204).json({ Error: err })
    }
})

// 9. Crear el endpoint que permita obtener el nombre de un usuario que se indica por id.
app.get('/usuarios/:id/nombre', async (req, res) => {
    try {
        let idUser = parseInt(req.params.id)
        let userExist = await Usuario.findByPk(idUser)
        if (!userExist) {
            res.status(204).json({ message: 'El usuario no fue encontrado' })
        }
        res.status(200).json({ 'El nombre del usuario es :': userExist.nombre })
    } catch (err) {
        res.status(204).json({ Error: err })
    }
})

// 10. Crear el endpoint que permita obtener el total del stock actual de productos, la sumatoria de los precios individuales.

app.get('/productos/total', async (req, res) => {
    try {
        const total = await Producto.sum('precio')
        res.status(200).json({ 'La suma de todos los productos es de : ': total })
    } catch (err) {
        res.status(204).json({ Error: err })
    }
})

try {
    await db.authenticate()
    console.log('Conexion con la DB establecida')
} catch (error) {
    console.log(' Error de conexion ', error)
}

app.listen(expossedPort, () => {
    console.log(`Server listen in port ${expossedPort}`)
})
