import { useNavigate } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'

function Carrito() {
  const navigate = useNavigate()
  const { carrito, cambiarCantidad, eliminarDelCarrito, total, cantidadItems } = useCarrito()

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* Header */}
      <div className="bg-white shadow px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Tu Carrito</h1>
          <p className="text-gray-400 text-sm">{cantidadItems} items</p>
        </div>
        <button onClick={() => navigate('/catalogo')} className="text-gray-500 text-xl">✕</button>
      </div>

      {/* Lista */}
      <div className="flex-1 px-4 py-4 flex flex-col gap-4">
        {carrito.length === 0 ? (
          <div className="text-center mt-20">
            <p className="text-gray-400 text-lg">El carrito está vacío</p>
            <button
              onClick={() => navigate('/catalogo')}
              className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold"
            >
              Ver productos
            </button>
          </div>
        ) : (
          carrito.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                {item.imagen
                  ? <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover rounded-lg" />
                  : <span className="text-gray-400 text-xs">Sin imagen</span>
                }
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-700">{item.nombre}</p>
                <p className="text-red-500 font-bold">${Number(item.precio).toLocaleString()}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button onClick={() => cambiarCantidad(item.id, -1)} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center">−</button>
                  <span className="font-semibold">{item.cantidad}</span>
                  <button onClick={() => cambiarCantidad(item.id, 1)} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center">+</button>
                </div>
              </div>
              <button onClick={() => eliminarDelCarrito(item.id)} className="text-gray-400 text-xl">✕</button>
            </div>
          ))
        )}
      </div>

      {/* Total y pagar */}
      {carrito.length > 0 && (
        <div className="bg-white px-4 py-6 shadow-inner">
          <div className="flex justify-between mb-4">
            <span className="text-gray-600 font-semibold">Total</span>
            <span className="text-blue-600 font-bold text-xl">${total.toLocaleString()}</span>
          </div>
          <button
            onClick={() => navigate('/confirmacion')}
            className="w-full bg-green-500 text-white py-4 rounded-full font-bold text-lg hover:bg-green-600 transition-all"
          >
            PAGAR
          </button>
          <p className="text-center text-gray-400 text-xs mt-3">ENVÍOS A TODO EL PAÍS · PAGOS 100% SEGUROS</p>
        </div>
      )}

    </div>
  )
}

export default Carrito