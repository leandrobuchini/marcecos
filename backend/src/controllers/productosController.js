const db = require('../database/db')

const getProductos = async (req, res) => {
  try {
    const resultado = await db.query('SELECT * FROM productos ORDER BY creado_en DESC')
    res.json(resultado.rows)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' })
  }
}

const getProducto = async (req, res) => {
  try {
    const { id } = req.params
    const resultado = await db.query('SELECT * FROM productos WHERE id = $1', [id])
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }
    res.json(resultado.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener producto' })
  }
}

const crearProducto = async (req, res) => {
  try {
    const { nombre, precio, categoria, descripcion, imagen, stock } = req.body
    const resultado = await db.query(
      'INSERT INTO productos (nombre, precio, categoria, descripcion, imagen, stock) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [nombre, precio, categoria, descripcion, imagen, stock]
    )
    res.json({ mensaje: 'Producto creado', id: resultado.rows[0].id })
  } catch (error) {
    res.status(500).json({ error: 'Error al crear producto' })
  }
}

const editarProducto = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, precio, categoria, descripcion, imagen, stock } = req.body
    await db.query(
      'UPDATE productos SET nombre=$1, precio=$2, categoria=$3, descripcion=$4, imagen=$5, stock=$6 WHERE id=$7',
      [nombre, precio, categoria, descripcion, imagen, stock, id]
    )
    res.json({ mensaje: 'Producto actualizado' })
  } catch (error) {
    res.status(500).json({ error: 'Error al editar producto' })
  }
}

const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params
    await db.query('DELETE FROM productos WHERE id = $1', [id])
    res.json({ mensaje: 'Producto eliminado' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' })
  }
}

module.exports = { getProductos, getProducto, crearProducto, editarProducto, eliminarProducto }