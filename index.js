import express from 'express'
import db from './db/connection.js'

import prodRouter from './routes/prodRouter.js'
import userRouter from './routes/userRouter.js'
import carritoRouter from './routes/carritoRouter.js'

import makeBody from './middlewares/makeBody.js'
import authentication from './middlewares/authentification.js'

const app = express()

const expossedPort = 8000

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

app.use(makeBody)

// Enrutacion
app.use('/', prodRouter)
app.use('/', userRouter)
app.use('/', carritoRouter)

// Endpoint validacion logueo
app.post('/auth', authentication)

try {
    await db.authenticate()  
    
    console.log('Conexion con la DB establecida')
} catch (error) {
    console.log(' Error de conexion ', error)
}

app.listen(expossedPort, () => {
    console.log(`Server listen in port ${expossedPort}`)
})
