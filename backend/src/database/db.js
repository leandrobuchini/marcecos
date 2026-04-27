const { Pool } = require('pg')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('render.com')
    ? { rejectUnauthorized: false }
    : false
})

const init = async () => {
  try {
    // Crea las tablas si no existen
    await pool.query(`
      CREATE TABLE IF NOT EXISTS productos (
        id SERIAL PRIMARY KEY,
        nombre TEXT NOT NULL,
        precio NUMERIC NOT NULL,
        categoria TEXT NOT NULL,
        descripcion TEXT,
        imagen TEXT,
        stock INTEGER DEFAULT 0,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        rol TEXT DEFAULT 'admin'
      );
    `)

    // Crea el usuario admin si no existe
    const resultado = await pool.query('SELECT * FROM usuarios WHERE email = $1', ['admin@marcecos.com'])
    
    if (resultado.rows.length === 0) {
      const passwordEncriptada = bcrypt.hashSync('marcecos123', 10)
      await pool.query(
        'INSERT INTO usuarios (email, password, rol) VALUES ($1, $2, $3)',
        ['admin@marcecos.com', passwordEncriptada, 'admin']
      )
      console.log('Usuario admin creado')
    }

    console.log('Base de datos lista')
  } catch (error) {
    console.log('Error al inicializar la base de datos:', error.message)
  }
}

init()

module.exports = pool