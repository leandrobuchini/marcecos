const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../database/db')

// Registro de cliente nuevo
const registrar = async (req, res) => {
  try {
    const { nombre, email, password } = req.body

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios' })
    }

    // Verificar si el email ya existe
    const existe = await db.query('SELECT * FROM clientes WHERE email = $1', [email])
    if (existe.rows.length > 0) {
      return res.status(400).json({ error: 'Ya existe una cuenta con ese email' })
    }

    // Encriptar contraseña
    const passwordEncriptada = bcrypt.hashSync(password, 10)

    // Crear el cliente
    const resultado = await db.query(
      'INSERT INTO clientes (nombre, email, password) VALUES ($1, $2, $3) RETURNING id, nombre, email',
      [nombre, email, passwordEncriptada]
    )

    const cliente = resultado.rows[0]

    // Crear token
    const token = jwt.sign(
      { id: cliente.id, email: cliente.email, rol: 'cliente' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({ mensaje: 'Cuenta creada correctamente', token, cliente })

  } catch (error) {
    console.log('ERROR:', error.message)
    res.status(500).json({ error: error.message })
  }
}

// Login de cliente
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const resultado = await db.query('SELECT * FROM clientes WHERE email = $1', [email])
    const cliente = resultado.rows[0]

    if (!cliente) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' })
    }

    const passwordCorrecta = bcrypt.compareSync(password, cliente.password)
    if (!passwordCorrecta) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' })
    }

    const token = jwt.sign(
      { id: cliente.id, email: cliente.email, rol: 'cliente' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      mensaje: 'Login exitoso',
      token,
      cliente: {
        id: cliente.id,
        nombre: cliente.nombre,
        email: cliente.email,
        telefono: cliente.telefono,
        direccion: cliente.direccion,
        ciudad: cliente.ciudad
      }
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Obtener perfil del cliente
const getPerfil = async (req, res) => {
  try {
    const resultado = await db.query(
      'SELECT id, nombre, email, telefono, direccion, ciudad, creado_en FROM clientes WHERE id = $1',
      [req.usuario.id]
    )
    res.json(resultado.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Actualizar perfil del cliente
const actualizarPerfil = async (req, res) => {
  try {
    const { nombre, telefono, direccion, ciudad } = req.body
    await db.query(
      'UPDATE clientes SET nombre=$1, telefono=$2, direccion=$3, ciudad=$4 WHERE id=$5',
      [nombre, telefono, direccion, ciudad, req.usuario.id]
    )
    res.json({ mensaje: 'Perfil actualizado correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getMisPedidos = async (req, res) => {
  try {
    const resultado = await db.query(
      'SELECT * FROM pedidos WHERE cliente_id = $1 ORDER BY creado_en DESC',
      [req.usuario.id]
    )
    res.json(resultado.rows)
  } catch (error) {
    console.log('ERROR PEDIDOS CLIENTE:', error.message)
    res.status(500).json({ error: error.message })
  }
}
module.exports = { registrar, login, getPerfil, actualizarPerfil, getMisPedidos }