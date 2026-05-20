import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function AdminPanel() {
  const navigate = useNavigate()
  const [vista, setVista] = useState('agregar')
  const [productos, setProductos] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [categoria, setCategoria] = useState('')
  const [stock, setStock] = useState('')
  const [imagen, setImagen] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [editando, setEditando] = useState(null)
  const [subiendoFoto, setSubiendoFoto] = useState(false)

  const cargarProductos = () => {
    api.get('/productos')
      .then(res => setProductos(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
  }

  const cargarPedidos = () => {
    api.get('/pedidos')
      .then(res => setPedidos(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
  }

  useEffect(() => {
    cargarProductos()
    cargarPedidos()
  }, [])

  const limpiarFormulario = () => {
    setNombre(''); setPrecio(''); setCategoria('')
    setStock(''); setImagen(''); setEditando(null)
    setError(''); setMensaje('')
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
      setMensaje('Foto subida!')
    } catch {
      setError('Error al subir la foto')
    }
    setSubiendoFoto(false)
  }

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

  const tabs = [
    { id: 'agregar', label: editando ? 'Editando' : 'Agregar' },
    { id: 'lista', label: `Productos (${productos.length})` },
    { id: 'pedidos', label: `Pedidos (${pedidos.length})` },
  ]

  return (
    <div className="min-h-screen bg-neutral-50">

      {/* Header */}
      <div className="bg-neutral-950 px-4 py-4 flex items-center justify-between">
        <h1 className="text-white text-base font-semibold tracking-tight">Panel Marcecos</h1>
        <button onClick={handleLogout} className="text-neutral-500 text-sm hover:text-neutral-300 transition-colors">
          Salir
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-neutral-100">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setVista(tab.id); limpiarFormulario() }}
            className={`flex-1 py-3 text-xs font-semibold tracking-wide uppercase transition-colors ${
              vista === tab.id
                ? 'text-neutral-900 border-b-2 border-neutral-900'
                : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Vista Agregar / Editar */}
      {vista === 'agregar' && (
        <div className="px-4 py-6 flex flex-col gap-3 max-w-md mx-auto">

          <input
            type="text"
            placeholder="Nombre del producto"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            className="w-full border border-neutral-200 bg-white rounded-xl px-4 py-3 text-sm outline-none focus:border-neutral-400 transition-colors"
          />
          <input
            type="number"
            placeholder="$ Precio"
            value={precio}
            onChange={e => setPrecio(e.target.value)}
            className="w-full border border-neutral-200 bg-white rounded-xl px-4 py-3 text-sm outline-none focus:border-neutral-400 transition-colors"
          />
          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={e => setStock(e.target.value)}
            className="w-full border border-neutral-200 bg-white rounded-xl px-4 py-3 text-sm outline-none focus:border-neutral-400 transition-colors"
          />

          <select
            value={categoria}
            onChange={e => setCategoria(e.target.value)}
            className="w-full border border-neutral-200 bg-white rounded-xl px-4 py-3 text-sm outline-none focus:border-neutral-400 transition-colors text-neutral-500"
          >
            <option value="">Categoría</option>
            <option value="Juegos">Juegos</option>
            <option value="Maderas">Maderas</option>
            <option value="Bebes">Bebés</option>
            <option value="Exterior">Exterior</option>
            <option value="Educativos">Educativos</option>
          </select>

          {/* Foto */}
          <div className="border-2 border-dashed border-neutral-200 rounded-2xl overflow-hidden">
            {imagen ? (
              <div className="relative">
                <img src={imagen} alt="preview" className="w-full h-40 object-cover" />
                <button
                  onClick={() => setImagen('')}
                  className="absolute top-2 right-2 bg-white rounded-full w-7 h-7 flex items-center justify-center text-neutral-500 text-sm border border-neutral-200"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center gap-2 py-8">
                <span className="text-3xl">📷</span>
                <span className="text-sm text-neutral-400">
                  {subiendoFoto ? 'Subiendo...' : 'Tocar para subir foto'}
                </span>
                <span className="text-xs text-neutral-300">JPG, PNG o WEBP</span>
                <input type="file" accept="image/*" onChange={handleFoto} className="hidden" disabled={subiendoFoto} />
              </label>
            )}
          </div>

          {error && <p className="text-xs text-red-400 text-center">{error}</p>}
          {mensaje && <p className="text-xs text-neutral-500 text-center">{mensaje}</p>}

          <button
            onClick={handleGuardar}
            className="w-full bg-neutral-900 text-white py-3.5 rounded-full text-sm font-bold tracking-wide hover:bg-neutral-700 transition-colors"
          >
            {editando ? 'Guardar cambios' : '+ Agregar al catálogo'}
          </button>

          {editando && (
            <button
              onClick={limpiarFormulario}
              className="w-full border border-neutral-200 text-neutral-500 py-3 rounded-full text-sm font-medium hover:border-neutral-400 transition-colors"
            >
              Cancelar edición
            </button>
          )}

          <button
            onClick={() => navigate('/catalogo')}
            className="w-full border border-neutral-200 text-neutral-500 py-3 rounded-full text-sm font-medium hover:border-neutral-400 transition-colors"
          >
            Ver catálogo
          </button>
        </div>
      )}

      {/* Vista Lista */}
      {vista === 'lista' && (
        <div className="px-4 py-6 flex flex-col gap-3 max-w-md mx-auto">
          {mensaje && <p className="text-xs text-neutral-500 text-center">{mensaje}</p>}
          {productos.length === 0 ? (
            <p className="text-center text-neutral-400 text-sm mt-10">No hay productos todavía</p>
          ) : (
            productos.map(producto => (
              <div key={producto.id} className="bg-white rounded-2xl border border-neutral-100 p-3 flex items-center gap-3">
                <div className="w-14 h-14 bg-neutral-50 rounded-xl overflow-hidden flex-shrink-0">
                  {producto.imagen
                    ? <img src={producto.imagen} alt={producto.nombre} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-neutral-300 text-xs">Sin foto</div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 truncate">{producto.nombre}</p>
                  <p className="text-xs font-bold text-neutral-900">${Number(producto.precio).toLocaleString()}</p>
                  <p className="text-xs text-neutral-400">Stock: {producto.stock} · {producto.categoria}</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => handleEditar(producto)}
                    className="text-xs px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(producto.id)}
                    className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-400 hover:bg-red-100 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Vista Pedidos */}
      {vista === 'pedidos' && (
        <div className="px-4 py-6 flex flex-col gap-3 max-w-md mx-auto">
          {pedidos.length === 0 ? (
            <p className="text-center text-neutral-400 text-sm mt-10">No hay pedidos todavía</p>
          ) : (
            pedidos.map(pedido => (
              <div key={pedido.id} className="bg-white rounded-2xl border border-neutral-100 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">Pedido #{pedido.id}</p>
                    <p className="text-xs text-neutral-400">
                      {new Date(pedido.creado_en).toLocaleDateString('es-AR', {
                        day: '2-digit', month: '2-digit', year: 'numeric'
                      })}
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    pedido.estado === 'pendiente' ? 'bg-amber-50 text-amber-600' :
                    pedido.estado === 'enviado' ? 'bg-blue-50 text-blue-600' :
                    'bg-green-50 text-green-600'
                  }`}>
                    {pedido.estado}
                  </span>
                </div>

                <div className="flex flex-col gap-1 mb-3">
                  {pedido.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <span className="text-neutral-500">{item.nombre} x{item.cantidad}</span>
                      <span className="text-neutral-900 font-medium">${Number(item.precio * item.cantidad).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between border-t border-neutral-100 pt-3 mb-3">
                  <span className="text-sm font-semibold text-neutral-700">Total</span>
                  <span className="text-sm font-bold text-neutral-900">${Number(pedido.total).toLocaleString()}</span>
                </div>

                <select
                  value={pedido.estado}
                  onChange={async (e) => {
                    await api.put(`/pedidos/${pedido.id}`, { estado: e.target.value })
                    cargarPedidos()
                  }}
                  className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm outline-none"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="enviado">Enviado</option>
                  <option value="entregado">Entregado</option>
                </select>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  )
}