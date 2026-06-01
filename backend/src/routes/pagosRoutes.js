const express = require('express')
const router = express.Router()
const { crearPreferencia, confirmarPago } = require('../controllers/pagosController')
const { verificarToken } = require('../middleware/authMiddleware')

router.post('/crear', verificarToken, crearPreferencia)
router.post('/confirmar', confirmarPago)

module.exports = router