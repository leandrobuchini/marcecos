const express = require('express')
const router = express.Router()
const {
  getProductos,
  getProducto,
  crearProducto,
  editarProducto,
  eliminarProducto
} = require('../controllers/productosController')
const { upload } = require('../config/cloudinary')

router.get('/', getProductos)
router.get('/:id', getProducto)
router.post('/', crearProducto)
router.put('/:id', editarProducto)
router.delete('/:id', eliminarProducto)

// Ruta especial para subir imágenes
router.post('/upload', (req, res) => {
  upload.single('imagen')(req, res, (err) => {
    if (err) {
      console.log('ERROR MULTER:', err)
      return res.status(500).json({ error: err.message })
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ningún archivo' })
    }
    console.log('Archivo subido:', req.file)
    res.json({ url: req.file.path })
  })
})

module.exports = router