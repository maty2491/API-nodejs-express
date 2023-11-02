import Usuario from "../models/usuario.js"
import jwt from 'jsonwebtoken'

async function authentication (req, res) {

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
      const rol = userFind[0].id_rol
      // Firma y construccion de TOKEN
      const token = jwt.sign({
          sub,
          user,
          rol,
          exp: Date.now() + (300 * 1000)
      }, process.env.SECRET_KEY)
      res.status(200).json({ accessToken: token })
    }

export default authentication