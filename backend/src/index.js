const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

// Carga las variables del archivo .env
dotenv.config()

// Inicializa la base de datos
require('./database/db')

const app = express()

const productosRoutes = require('./routes/productosRoutes')
const authRoutes = require('./routes/authRoutes')

// Permite recibir datos en formato JSON
app.use(express.json())

// Permite que el frontend se comunique con el backend
app.use(cors()) 

// Ruta de prueba para verificar que el servidor funciona
app.get('/', (req, res) =>{
    res.json({ menssaje: 'Servidor de Marcecos funcionando!' })
})

app.use('/api/productos', productosRoutes)
app.use('/api/auth', authRoutes)

// Puerto donde corre el servidor
const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})