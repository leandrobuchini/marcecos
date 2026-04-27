const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../database/db')

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const resultado = await db.query('SELECT * FROM usuarios WHERE email = $1', [email])
    const usuario = resultado.rows[0]

    if (!usuario) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' })
    }

    const passwordCorrecta = bcrypt.compareSync(password, usuario.password)

    if (!passwordCorrecta) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' })
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: { id: usuario.id, email: usuario.email, rol: usuario.rol }
    })

  } catch (error) {
    console.log('ERROR:', error)
    res.status(500).json({ error: error.message })
  }
}

module.exports = { login }