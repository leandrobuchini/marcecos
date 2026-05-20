import { useNavigate } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'

export default function Carrito() {
  const navigate = useNavigate()
  const { carrito, cambiarCantidad, eliminarDelCarrito, total, cantidadItems } = useCarrito()

  const handleWhatsApp = () => {
    const mensaje = '🛒 Hola! Quiero hacer un pedido en Marcecos:\n\n' +
      carrito.map(item => `• ${item.nombre} x${item.cantidad} - $${Number(item.precio * item.cantidad).toLocaleString()}`).join('\n') +
      `\n\nTotal: $${total.toLocaleString()}`
    window.open(`https://wa.me/543425298828?text=${encodeURIComponent(mensaje)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">

      {/* Header */}
      <div className="bg-white border-b border-neutral-100 px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-neutral-900">Tu carrito</h1>
          <p className="text-xs text-neutral-400 mt-0.5">{cantidadItems} {cantidadItems === 1 ? 'producto' : 'productos'}</p>
        </div>
        <button
          onClick={() => navigate('/catalogo')}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Lista */}
      <div className="flex-1 px-4 py-4 flex flex-col gap-3">
        {carrito.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-24">
            <p className="text-neutral-400 text-sm mb-4">Tu carrito está vacío</p>
            <button
              onClick={() => navigate('/catalogo')}
              className="bg-neutral-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-neutral-700 transition-colors"
            >
              Ver productos
            </button>
          </div>
        ) : (
          carrito.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-neutral-100 p-3 flex items-center gap-3">
              <div className="w-18 h-18 bg-neutral-50 rounded-xl overflow-hidden flex-shrink-0 w-16 h-16">
                {item.imagen
                  ? <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-neutral-300 text-xs">Sin foto</div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900 truncate">{item.nombre}</p>
                <p className="text-xs font-bold text-neutral-900 mt-0.5">${Number(item.precio).toLocaleString()}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => cambiarCantidad(item.id, -1)}
                    className="w-6 h-6 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:border-neutral-400 transition-colors text-sm"
                  >
                    −
                  </button>
                  <span className="text-sm font-semibold text-neutral-900 w-4 text-center">{item.cantidad}</span>
                  <button
                    onClick={() => cambiarCantidad(item.id, 1)}
                    className="w-6 h-6 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:border-neutral-400 transition-colors text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => eliminarDelCarrito(item.id)}
                className="text-neutral-300 hover:text-neutral-500 transition-colors text-lg flex-shrink-0"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {carrito.length > 0 && (
        <div className="bg-white border-t border-neutral-100 px-4 py-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-neutral-500">Total</span>
            <span className="text-xl font-bold text-neutral-900">${total.toLocaleString()}</span>
          </div>
          <button
            onClick={handleWhatsApp}
            className="w-full bg-neutral-900 text-white py-3.5 rounded-full text-sm font-bold tracking-wide hover:bg-neutral-700 transition-colors mb-2"
          >
            Consultar por WhatsApp
          </button>
          <p className="text-center text-neutral-400 text-xs mt-2">Envíos a todo el país · Pagos seguros</p>
        </div>
      )}

    </div>
  )
}