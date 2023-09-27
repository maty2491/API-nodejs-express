import { createRequire } from 'node:module'
import express from 'express'

const require = createRequire(import.meta.url)

const datos = require('./datos.json')

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

app.get('/', (req, res) => {
  res.status(200).send(html)
})

// 1. Crear el endpoint ‘/usuarios/’, que devuelva el listado completo de usuarios.

app.get('/usuarios', (req, res) => {
  try {
    const allUsers = datos.usuarios
    res.status(200).json(allUsers)
  } catch (error) {
    res.status(204).json({ message: error })
  }
})

app.get('/productos', (req, res) => {
  try {
    const allProduct = datos.productos
    res.status(200).json(allProduct)
  } catch (error) {
    res.status(204).json({ message: error })
  }
})

// 2. Crear el endpoint ‘/usuarios/id’ que devuelva los datos de un usuario en particular consignado por su número de id.

app.get('/usuarios/:id', (req, res) => {
  try {
    let userId = parseInt(req.params.id)
    let userEncontrado = datos.usuarios.find((usuarios) => usuarios.id === userId)
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

app.post('/usuarios/', (req, res) => {
  try {
    let newUser = ''
    req.on('data', (chunk) => {
      newUser += chunk.toString()
    })

    req.on('end', () => {
      const data = JSON.parse(newUser)
      req.body = data
      datos.usuarios.push(req.body)
    })
    res.status(201).json({ message: 'Usuario creado' })
  } catch (error) {
    res.status(204).json({ message: 'error' })
  }
})

// 4. Crear el endpoint ‘/usuarios/id’ que permita modificar algún atributo de un usuario.

app.patch('/usuarios/:id', (req, res) => {

  let idUserUpdate = parseInt(req.params.id)
  let userUpdate = datos.usuarios.find((usuario) => usuario.id === idUserUpdate)

  if (!userUpdate) {
    res.status(204).json({ message: ' Usuario no encontrado '})
  }

  let newUser = ''

  req.on('data', (chunk) => {
    newUser += chunk.toString()
  })

  req.on('end', () => {
    const data = JSON.parse(newUser)
    req.body = data

    if (data.nombre) {
      userUpdate.nombre = data.nombre
    }

    if (data.tipo) {
      userUpdate.edad = data.edad
    }

    if (data.email) {
      userUpdate.email = data.email
    }
    if (data.telefono) {
      userUpdate.telefono = data.telefono
    }

    res.status(200).send('Usuario actualizado')
  })
})
// 5. Crear el endpoint ‘/usuarios/id’ que permita borrar un usuario de los datos.

app.delete('/usuarios/:id', (req, res) => {
  let idUserDelete = parseInt(req.params.id)
  let userDelete = datos.usuarios.find((usuario) => usuario.id === idUserDelete)

  if (!userDelete) {
    res.status(204).json({ message: 'Usuario no encontrado' })
  }

  let indexUserDelete = datos.usuarios.indexOf(userDelete)

  try {
    datos.usuarios.splice(indexUserDelete, 1)
    res.status(200).json({message: 'Usuario borrado'})
  } catch (error) {
    res.status(204).json({message: 'Error' })
  }
})

// 6. Crear el endpoint que permita obtener el precio de un producto que se indica por id.

app.get('/productos/:id/precio', (req, res) => {
  const idProduct = parseInt(req.params.id)
  const productExist = datos.productos.find((producto) => producto.id === idProduct)

  if (productExist) {
    res.status(200).json({'El precio del producto es ': productExist.precio})
  } else {
    res.status(404).json({ message: 'El producto no existe' })
  }
})

// 7. Crear el endpoint que permita obtener el nombre de un producto que se indica por id.

app.get('/productos/:id/nombre', (req, res) => {
  const idProduct = parseInt(req.params.id)
  const productExist = datos.productos.find((producto) => producto.id === idProduct)

  if (productExist) {
    res.status(200).json({ 'El nombre del producto es ': productExist.nombre })
  } else {
    res.status(404).json({ message: 'El producto no existe' })
  }
})

// 8. Crear el endpoint que permita obtener el teléfono de un usuario que se indica por id.

app.get('/usuarios/:id/telefono', (req, res) => {
  try {
    let idUser = parseInt(req.params.id)
    let userExist = datos.usuarios.find((usuario) => usuario.id === idUser)
    if (!userExist) {
      res.status(204).json({ message: 'El usuario no fue encontrado' })
    }
    res.status(200).json({ 'El telefono del usuario es:': userExist.telefono })
  } catch (err) {
    res.status(204).json({ Error: err })
  }
})

// 9. Crear el endpoint que permita obtener el nombre de un usuario que se indica por id.
app.get('/usuarios/:id/nombre', (req, res) => {
  try {
    let idUser = parseInt(req.params.id) 
    let userExist = datos.usuarios.find((usuario) => usuario.id === idUser)
    if (!userExist) {
      res.status(204).json({ message: 'El usuario no fue encontrado' })
    }
    res.status(200).json({ 'El nombre del usuario es :': userExist.nombre })
  } catch (err) {
    res.status(204).json({ Error: err })
  }
})

// 10. Crear el endpoint que permita obtener el total del stock actual de productos, la sumatoria de los precios individuales.

app.get('/productos/total', (req, res) => {
  try {
    const total = datos.productos.reduce((precioTotal, producto) => {
      if (typeof producto.precio === 'number') {
        return precioTotal + producto.precio
      } else {
        return precioTotal
      }
    }, 0)
    const totalConDosDecimales = parseFloat(total.toFixed(2))
    res.status(200).json({ 'La suma de todos los productos es de : ': totalConDosDecimales })
  } catch (err) {
    res.status(204).json({ Error: err })
  }
})

app.listen(expossedPort, () => {
  console.log(`Server listen in port ${expossedPort}`)
})
