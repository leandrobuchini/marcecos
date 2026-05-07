const express = require('express')
const router = express.Router()
const { getPedidos, actualizarEstado } = require('../controllers/pedidosController')

router.get('/', getPedidos)
router.put('/:id', actualizarEstado)

module.exports = router