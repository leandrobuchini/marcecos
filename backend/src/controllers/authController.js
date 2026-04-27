const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../database/db')

const login = (req, res) => {
    try {
        const { email, password } = req.body

        //Busca el usuario en la base de datos
        const usuario = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email)

        //Si no existe el usuario
        if (!usuario) {
            return res.status(401).json({ error: 'Email o contraseña incorrectos' })
        }

        // Crea el token de seguridad que dura 8 horas
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