const db = require('../database/db')

// Obtener todos los productos
const getProductos = (req, res) => {
    try {
        const productos =db.prepare('SELECT * FROM productos').all()
        res.json(productos)
    } catch (errro) {
        res.status(500).json({ error: 'Error al obtener productos' })
    }
}

// Obtener un producto por id
const getProducto = (req, res) => {
    try {
        const { id } = req.params
        const producto = db.prepare('SELECT * FROM productos WHERE id = ?').get(id)
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' })
        }
        res.json(producto)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener producto' })
    }
}

// Crear un producto nuevo
const crearProducto = (req, res) => {
    try {
        const { nombre, precio, categoria, descripcion, imagen, stock } = req.body
        const resultado = db.prepare(`
            INSERT INTO productos (nombre, precio, categoria, descripcion, imagen, stock)
            VALUES (?, ?, ?, ?, ?, ?)
            `).run(nombre, precio, categoria, descripcion, imagen, stock)
            res.json({ mensaje: 'Producto creado', id: resultado.lastInsertRowid })
    } catch (error) {
        res.status(500).json({ error: 'Error al crear producto' })
    }
}

//Editar un producto
const editarProducto = (req, res) => {
    try {
        const { id } = req.params
        const { nombre, precio, categoria, descripcion, imagen, stock } = req.body
        db.prepare(`
            UPDATE productos SET nombre=?, precio=?, categoria=?, descripcion=?, imagen=?, stock=?
             WHERE id=?
            `).run(nombre, precio, categoria, descripcion, imagen, stock, id)
            res.json({ mensaje: 'Producto actualizado' })
    } catch (error) {
        res.status(500).json({ error: 'Error al editar producto' })
    }
}

//Eliminar un producto
const eliminarProducto = (req, res) => {
    try {
        const { id } = req.params
        db.prepare('DELETE FROM productos WHERE id = ?').run(id)
        res.json({ mensaje: 'Producto eliminado' })
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar producto' })
    }
}

module.exports = { getProductos, getProducto, crearProducto, editarProducto, eliminarProducto }