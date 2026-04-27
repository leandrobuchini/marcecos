import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function AdminPanel() {
  const navigate = useNavigate()
  const [vista, setVista] = useState('agregar')
  const [productos, setProductos] = useState([])
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [categoria, setCategoria] = useState('')
  const [stock, setStock] = useState('')
  const [imagen, setImagen] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [editando, setEditando] = useState(null)
  const [subiendoFoto, setSubiendoFoto] = useState(false)

  // Trae todos los productos
  const cargarProductos = () => {
    api.get('/productos')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : []
        setProductos(data)
      })
      .catch(() => setError('Error al cargar productos'))
  }

  useEffect(() => {
    cargarProductos()
  }, [])

  // Limpia el formulario
  const limpiarFormulario = () => {
    setNombre('')
    setPrecio('')
    setCategoria('')
    setStock('')
    setImagen('')
    setEditando(null)
    setError('')
    setMensaje('')
  }

  const handleFoto = async (e) => {
  const archivo = e.target.files[0]
  if (!archivo) return

  setSubiendoFoto(true)
  try {
    const formData = new FormData()
    formData.append('imagen', archivo)

    const res = await api.post('/productos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    setImagen(res.data.url)
    setMensaje('Foto subida correctamente!')
  } catch {
    setError('Error al subir la foto')
  }
  setSubiendoFoto(false)
}

  // Agrega o edita un producto
  const handleGuardar = async () => {
    if (!nombre || !precio || !categoria) {
      setError('Nombre, precio y categoría son obligatorios')
      return
    }

    try {
      if (editando) {
        await api.put(`/productos/${editando}`, {
          nombre, precio: Number(precio),
          categoria, stock: Number(stock) || 0, imagen
        })
        setMensaje('Producto actualizado!')
      } else {
        await api.post('/productos', {
          nombre, precio: Number(precio),
          categoria, stock: Number(stock) || 0, imagen
        })
        setMensaje('Producto agregado!')
      }
      setError('')
      limpiarFormulario()
      cargarProductos()
    } catch {
      setError('Error al guardar producto')
    }
  }

  // Carga los datos del producto en el formulario para editar
  const handleEditar = (producto) => {
    setEditando(producto.id)
    setNombre(producto.nombre)
    setPrecio(producto.precio)
    setCategoria(producto.categoria)
    setStock(producto.stock)
    setImagen(producto.imagen || '')
    setVista('agregar')
    setMensaje('')
    setError('')
  }

  // Elimina un producto
  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que querés eliminar este producto?')) return
    try {
      await api.delete(`/productos/${id}`)
      setMensaje('Producto eliminado!')
      cargarProductos()
    } catch {
      setError('Error al eliminar producto')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-gray-900 px-4 py-4 flex items-center justify-between">
        <h1 className="text-white font-bold text-lg">Panel Marcecos</h1>
        <button onClick={handleLogout} className="text-gray-400 text-sm">Salir</button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-300 bg-white">
        <button
          onClick={() => { setVista('agregar'); limpiarFormulario() }}
          className={`flex-1 py-3 text-sm font-semibold ${vista === 'agregar' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          {editando ? 'Editando' : 'Agregar'}
        </button>
        <button
          onClick={() => { setVista('lista'); limpiarFormulario() }}
          className={`flex-1 py-3 text-sm font-semibold ${vista === 'lista' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          Mis productos ({productos.length})
        </button>
      </div>

      {/* Vista Agregar / Editar */}
      {vista === 'agregar' && (
        <div className="px-4 py-6 flex flex-col gap-4 max-w-md mx-auto">

          <input
            type="text"
            placeholder="Nombre del Producto"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 outline-none text-sm"
          />

          <input
            type="number"
            placeholder="$ Precio"
            value={precio}
            onChange={e => setPrecio(e.target.value)}
            className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 outline-none text-sm"
          />

          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={e => setStock(e.target.value)}
            className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 outline-none text-sm"
          />

          <select
            value={categoria}
            onChange={e => setCategoria(e.target.value)}
            className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 outline-none text-sm text-gray-500"
          >
            <option value="">Categorías</option>
            <option value="Juegos">Juegos</option>
            <option value="Maderas">Maderas</option>
            <option value="Bebes">Bebés</option>
            <option value="Exterior">Exterior</option>
            <option value="Educativos">Educativos</option>
          </select>

          {/* Subir foto */}
<div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
  {imagen ? (
    <div className="flex flex-col items-center gap-2">
      <img src={imagen} alt="preview" className="w-32 h-32 object-cover rounded-lg" />
      <button
        onClick={() => setImagen('')}
        className="text-red-500 text-sm"
      >
        Cambiar foto
      </button>
    </div>
  ) : (
    <label className="cursor-pointer flex flex-col items-center gap-2">
      <span className="text-4xl">📷</span>
      <span className="text-gray-500 text-sm">
        {subiendoFoto ? 'Subiendo...' : 'Tocá para subir una foto'}
      </span>
      <span className="text-gray-400 text-xs">JPG, PNG o WEBP</span>
      <input
        type="file"
        accept="image/*"
        onChange={handleFoto}
        className="hidden"
        disabled={subiendoFoto}
      />
    </label>
  )}
</div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {mensaje && <p className="text-green-500 text-sm text-center">{mensaje}</p>}

          <button
            onClick={handleGuardar}
            className="w-full bg-blue-600 text-white py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all"
          >
            {editando ? 'GUARDAR CAMBIOS' : '+ AGREGAR AL CATÁLOGO'}
          </button>

          {editando && (
            <button
              onClick={limpiarFormulario}
              className="w-full border border-gray-300 text-gray-600 py-3 rounded-full font-semibold"
            >
              Cancelar edición
            </button>
          )}

          <button
            onClick={() => navigate('/catalogo')}
            className="w-full border border-gray-300 text-gray-600 py-3 rounded-full font-semibold"
          >
            Ver catálogo
          </button>
        </div>
      )}

      {/* Vista Lista de productos */}
      {vista === 'lista' && (
        <div className="px-4 py-6 flex flex-col gap-4 max-w-md mx-auto">
          {mensaje && <p className="text-green-500 text-sm text-center">{mensaje}</p>}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {productos.length === 0 ? (
            <p className="text-center text-gray-400 mt-10">No hay productos todavía</p>
          ) : (
            productos.map(producto => (
              <div key={producto.id} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  {producto.imagen
                    ? <img src={producto.imagen} alt={producto.nombre} className="w-full h-full object-cover rounded-lg" />
                    : <span className="text-gray-400 text-xs">Sin foto</span>
                  }
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-700 text-sm">{producto.nombre}</p>
                  <p className="text-red-500 font-bold text-sm">${Number(producto.precio).toLocaleString()}</p>
                  <p className="text-gray-400 text-xs">Stock: {producto.stock} | {producto.categoria}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleEditar(producto)}
                    className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full font-semibold"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(producto.id)}
                    className="bg-red-100 text-red-500 text-xs px-3 py-1 rounded-full font-semibold"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  )
}

export default AdminPanel