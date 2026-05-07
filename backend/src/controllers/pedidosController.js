const db = require('../database/db')

// Obtener todos los pedidos
const getPedidos = async (req, res) => {
    try {
        const resultado = await db.query(
            'SELECT * FROM pedidos ORDER BY creado_en DESC'
        )
        res.json(resultado.rows)
    } catch (error) {
  console.log('ERROR PEDIDOS:', error.message)
  res.status(500).json({ error: error.message })
}
}

// Cambiar el estado de un pedido
const actualizarEstado = async (req, res) => {
    try {
        const { id } = req.params
        const { estado } = req.body
        await db.query(
            'UPDATE pedidos SET estado = $1 WHERE id = $2',
            [estado, id]
        )
        res.json({ mensaje: 'EStado actualizado' })
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar estado' })
    }
}

module.exports = { getPedidos, actualizarEstado }