import { useNavigate } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import { useState } from 'react'
import api from '../services/api'

function Carrito() {
  const navigate = useNavigate()
  const { carrito, cambiarCantidad, eliminarDelCarrito, vaciarCarrito, total, cantidadItems } = useCarrito()
const [procesando, setProcesando] = useState(false)
  
const handlePagar = async () => {
  console.log('click en pagar', carrito)
  if (carrito.length === 0) return
  setProcesando(true)
  try {
    // Guarda el carrito en localStorage antes de ir a MercadoPago
    localStorage.setItem('carrito_comprado', JSON.stringify(
      carrito.map(item => ({ id: item.id, cantidad: item.cantidad }))
    ))
    const res = await api.post('/pagos/crear', { items: carrito })
    console.log('respuesta:', res.data)
    window.location.href = res.data.url
  } catch (error) {
    console.log('error:', error)
    alert('Error al procesar el pago. Intentá de nuevo.')
    setProcesando(false)
  }
}

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
  onClick={handlePagar}
  disabled={procesando}
  className={`w-full py-4 rounded-full font-bold text-lg transition-all
    ${procesando
      ? 'bg-gray-400 text-white cursor-not-allowed'
      : 'bg-green-500 text-white hover:bg-green-600'
    }`}
>
  {procesando ? 'Procesando...' : 'PAGAR CON MERCADOPAGO'}
</button>
          <p className="text-center text-gray-400 text-xs mt-3">ENVÍOS A TODO EL PAÍS · PAGOS 100% SEGUROS</p>
        </div>
      )}

    </div>
  )
}

export default Carrito