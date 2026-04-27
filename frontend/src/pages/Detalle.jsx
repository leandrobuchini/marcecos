import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useCarrito } from '../context/CarritoContext'
import api from '../services/api'

function Detalle() {
  const { agregarAlCarrito } = useCarrito()
  const { id } = useParams()
  const navigate = useNavigate()
  const [producto, setProducto] = useState(null)
  const [cantidad, setCantidad] = useState(1)
  const [agregado, setAgregado] = useState(false)

  useEffect(() => {
    api.get(`/productos/${id}`)
      .then(res => setProducto(res.data))
      .catch(() => navigate('/catalogo'))
  }, [id])

  if (!producto) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-white shadow px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/catalogo')} className="text-gray-500 text-xl">←</button>
        <h1 className="font-bold text-gray-800">Detalle del producto</h1>
      </div>

      {/* Imagen */}
      <div className="bg-white mx-4 mt-4 rounded-xl h-56 flex items-center justify-center shadow">
        {producto.imagen
          ? <img src={producto.imagen} alt={producto.nombre} className="h-full w-full object-cover rounded-xl" />
          : <span className="text-gray-400">Sin imagen</span>
        }
      </div>

      {/* Info */}
      <div className="bg-white mx-4 mt-4 rounded-xl shadow p-6">
        <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-semibold">
          {producto.categoria}
        </span>
        <h2 className="text-xl font-bold text-gray-800 mt-3">{producto.nombre}</h2>
        <p className="text-red-500 font-bold text-2xl mt-2">${Number(producto.precio).toLocaleString()}</p>
        {producto.descripcion && (
          <p className="text-gray-500 text-sm mt-3">{producto.descripcion}</p>
        )}
        <p className="text-gray-400 text-xs mt-2">Stock disponible: {producto.stock}</p>
      </div>

      {/* Cantidad y agregar */}
      <div className="mx-4 mt-4 bg-white rounded-xl shadow p-6">
        <p className="text-sm font-semibold text-gray-700 mb-3">Cantidad</p>
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setCantidad(prev => Math.max(1, prev - 1))}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-xl"
          >
            −
          </button>
          <span className="text-xl font-bold">{cantidad}</span>
          <button
            onClick={() => setCantidad(prev => prev + 1)}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-xl"
          >
            +
          </button>
        </div>

        {agregado ? (
          <div className="flex flex-col gap-3">
            <p className="text-green-500 text-center font-semibold">✅ Agregado al carrito!</p>
            <button
              onClick={() => navigate('/catalogo')}
              className="w-full border border-gray-300 text-gray-600 py-3 rounded-full font-semibold"
            >
              Seguir comprando
            </button>
          </div>
        ) : (
          <button
            onClick={() => { 
            agregarAlCarrito({ ...producto, cantidad }) 
            setAgregado(true) 
            }}
            className="w-full bg-blue-600 text-white py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all">
            Agregar al carrito
          </button>
        )}
      </div>

    </div>
  )
}

export default Detalle