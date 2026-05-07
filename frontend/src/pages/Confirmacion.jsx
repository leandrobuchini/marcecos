import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useCarrito } from '../context/CarritoContext'
import api from '../services/api'

function Confirmacion() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { vaciarCarrito } = useCarrito()
  const status = searchParams.get('status')

  useEffect(() => {
  if (status === 'success') {
    // Recupera los items del localStorage
    const itemsGuardados = JSON.parse(localStorage.getItem('carrito_comprado') || '[]')
    
    if (itemsGuardados.length > 0) {
      api.post('/pagos/confirmar', { items: itemsGuardados })
        .then(() => localStorage.removeItem('carrito_comprado'))
        .catch(err => console.log(err))
    }

    vaciarCarrito()
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [status])

  const config = {
    success: {
      icono: '✅',
      color: 'bg-green-100',
      titulo: 'Pedido confirmado!',
      mensaje: 'Tu pago fue procesado correctamente. Nos contactamos a la brevedad para coordinar el envío.',
    },
    failure: {
      icono: '❌',
      color: 'bg-red-100',
      titulo: 'Pago rechazado',
      mensaje: 'Hubo un problema con tu pago. Podés intentarlo de nuevo.',
    },
    pending: {
      icono: '⏳',
      color: 'bg-yellow-100',
      titulo: 'Pago pendiente',
      mensaje: 'Tu pago está siendo procesado. Te avisamos cuando se confirme.',
    },
  }

  const actual = config[status] || config.success

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">

        <div className={`w-20 h-20 ${actual.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
          <span className="text-4xl">{actual.icono}</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">{actual.titulo}</h1>
        <p className="text-gray-500 text-sm mb-8">{actual.mensaje}</p>

        <div className="border-t border-gray-200 pt-6 mb-6">
          <p className="text-xs text-gray-400">ENVÍOS A TODO EL PAÍS · PAGOS 100% SEGUROS</p>
        </div>

        {status === 'failure' ? (
          <button
            onClick={() => navigate('/carrito')}
            className="w-full bg-blue-600 text-white py-3 rounded-full font-bold hover:bg-blue-700 transition-all"
          >
            Volver al carrito
          </button>
        ) : (
          <button
            onClick={() => navigate('/catalogo')}
            className="w-full bg-blue-600 text-white py-3 rounded-full font-bold hover:bg-blue-700 transition-all"
          >
            Seguir comprando
          </button>
        )}

      </div>
    </div>
  )
}

export default Confirmacion