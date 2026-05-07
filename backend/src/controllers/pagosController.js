const { MercadoPagoConfig, Preference } = require('mercadopago')
const db = require('../database/db')
require('dotenv').config()

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
  options: { timeout: 5000 }
})

const crearPreferencia = async (req, res) => {
  try {
    const { items } = req.body

    // Verificar stock disponible
    for (const item of items) {
      const resultado = await db.query('SELECT stock FROM productos WHERE id = $1', [item.id])
      const producto = resultado.rows[0]

      if (!producto) {
        return res.status(404).json({ error: `Producto ${item.nombre} no encontrado` })
      }

      if (producto.stock < item.cantidad) {
        return res.status(400).json({ error: `Stock insuficiente para ${item.nombre}. Stock disponible: ${producto.stock}` })
      }
    }

    const preference = new Preference(client)

    const resultado = await preference.create({
      body: {
        items: items.map(item => ({
          title: item.nombre,
          quantity: item.cantidad,
          unit_price: Number(item.precio),
          currency_id: 'ARS',
          id: String(item.id)
        })),
        back_urls: {
          success: 'https://marcecos.vercel.app/confirmacion?status=success',
          failure: 'https://marcecos.vercel.app/confirmacion?status=failure',
          pending: 'https://marcecos.vercel.app/confirmacion?status=pending'
        },
        metadata: {
          items: items.map(item => ({
            id: item.id,
            cantidad: item.cantidad
          }))
        }
      }
    })

    // Restar stock y guardar pedido
    for (const item of items) {
      await db.query(
        'UPDATE productos SET stock = stock - $1 WHERE id = $2',
        [item.cantidad, item.id]
      )
    }

    const total = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0)
    await db.query(
      'INSERT INTO pedidos (items, total) VALUES ($1, $2)',
      [JSON.stringify(items), total]
    )
    console.log('Pedido guardado! Total:', total)

    res.json({ url: resultado.init_point })

  } catch (error) {
    console.log('ERROR MP:', error)
    res.status(500).json({ error: error.message })
  }
}

const confirmarPago = async (req, res) => {
  res.json({ mensaje: 'OK' })
}

module.exports = { crearPreferencia, confirmarPago }