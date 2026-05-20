import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from '../services/api'
import { useCarrito } from '../context/CarritoContext'

export default function Detalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [producto, setProducto] = useState(null)
  const [cantidad, setCantidad] = useState(1)
  const [agregado, setAgregado] = useState(false)
  const { agregarAlCarrito } = useCarrito()

  useEffect(() => {
    api.get(`/productos/${id}`)
      .then(res => setProducto(res.data))
      .catch(() => navigate('/catalogo'))
  }, [id])

  if (!producto) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <p className="text-neutral-400 text-sm">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">

      {/* Header */}
      <div className="bg-white border-b border-neutral-100 px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => navigate('/catalogo')}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors"
        >
          ←
        </button>
        <h1 className="text-sm font-semibold text-neutral-900 truncate">{producto.nombre}</h1>
      </div>

      {/* Imagen */}
      <div className="bg-white h-64 flex items-center justify-center border-b border-neutral-100">
        {producto.imagen
          ? <img src={producto.imagen} alt={producto.nombre} className="h-full w-full object-cover" />
          : <span className="text-neutral-300 text-sm">Sin imagen</span>
        }
      </div>

      {/* Info */}
      <div className="px-4 py-5">
        <div className="flex items-start justify-between mb-1">
          <h2 className="text-xl font-semibold text-neutral-900 tracking-tight flex-1">{producto.nombre}</h2>
          <span className="text-xs text-neutral-400 bg-neutral-100 px-3 py-1 rounded-full ml-3 flex-shrink-0">{producto.categoria}</span>
        </div>
        <p className="text-2xl font-bold text-neutral-900 mt-2">${Number(producto.precio).toLocaleString()}</p>
        {producto.descripcion && (
          <p className="text-sm text-neutral-500 mt-3 leading-relaxed">{producto.descripcion}</p>
        )}
        <p className="text-xs text-neutral-400 mt-3">Stock disponible: {producto.stock} unidades</p>
      </div>

      {/* Separador */}
      <div className="h-px bg-neutral-100 mx-4" />

      {/* Cantidad y agregar */}
      <div className="px-4 py-5">
        <p className="text-xs font-semibold text-neutral-900 tracking-widest uppercase mb-4">Cantidad</p>
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setCantidad(prev => Math.max(1, prev - 1))}
            className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:border-neutral-400 transition-colors"
          >
            −
          </button>
          <span className="text-xl font-semibold text-neutral-900 w-6 text-center">{cantidad}</span>
          <button
            onClick={() => setCantidad(prev => prev + 1)}
            className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:border-neutral-400 transition-colors"
          >
            +
          </button>
        </div>

        {agregado && (
          <p className="text-sm text-neutral-500 text-center mb-3">Agregado al carrito</p>
        )}

        <button
          onClick={() => { agregarAlCarrito({ ...producto, cantidad }); setAgregado(true) }}
          className="w-full bg-neutral-900 text-white py-3.5 rounded-full text-sm font-bold tracking-wide hover:bg-neutral-700 transition-colors mb-3"
        >
          Agregar al carrito
        </button>

        <button
          onClick={() => navigate('/carrito')}
          className="w-full border border-neutral-200 text-neutral-900 py-3 rounded-full text-sm font-medium hover:border-neutral-400 transition-colors"
        >
          Ver carrito
        </button>

      </div>

    </div>
  )
}