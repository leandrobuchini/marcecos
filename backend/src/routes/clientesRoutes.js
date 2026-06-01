const express = require('express')
const router = express.Router()
const { registrar, login, getPerfil, actualizarPerfil, getMisPedidos } = require('../controllers/clientesController')
const { verificarToken } = require('../middleware/authMiddleware')

router.post('/registrar', registrar)
router.post('/login', login)
router.get('/perfil', verificarToken, getPerfil)
router.put('/perfil', verificarToken, actualizarPerfil)
router.get('/pedidos', verificarToken, getMisPedidos)

module.exports = router