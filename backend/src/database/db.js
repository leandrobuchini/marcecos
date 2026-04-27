const Database = require('better-sqlite3')
const path = require('path')

// Crea o abre el archivo de base de datos
const db = new Database(path.join(__dirname, 'marcecos.db'))

// Crea las tablas si no existen
db.exec(`
    CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        precio REAL NOT NULL,
        categoria TEXT NOT NULL,
        descripcion TEXT,
        imagen TEXT,
        stock INTEGER DEFAULT 0,
        creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        rol TEXT DEFAULT 'admin'
    );
`) 

console.log('Base de datos lista')

const bcrypt = require('bcryptjs')

// Crea el usuario admin si no existe
const adminExiste = db.prepare('SELECT * FROM usuarios WHERE email = ?').get('admin@marcecos.com')

if (!adminExiste) {
  const passwordEncriptada = bcrypt.hashSync('marcecos123', 10)
  db.prepare('INSERT INTO usuarios (email, password, rol) VALUES (?, ?, ?)')
    .run('admin@marcecos.com', passwordEncriptada, 'admin')
  console.log('Usuario admin creado')
}

module.exports = db