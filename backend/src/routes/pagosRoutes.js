const express = require('express')
const router = express.Router()
const { crearPreferencia, confirmarPago } = require('../controllers/pagosController')

router.post('/crear', crearPreferencia)
router.post('/confirmar', confirmarPago)

module.exports = router