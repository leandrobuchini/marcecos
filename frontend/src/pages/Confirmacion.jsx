import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useCarrito } from '../context/CarritoContext'
import api from '../services/api'

export default function Confirmacion() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { vaciarCarrito } = useCarrito()
  const status = searchParams.get('status')

  useEffect(() => {
    if (status === 'success') {
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
      icono: '✓',
      titulo: 'Pedido confirmado',
      mensaje: 'Gracias por tu compra en Marcecos. Nos contactamos a la brevedad para coordinar el envío.',
      color: 'text-neutral-900'
    },
    failure: {
      icono: '✕',
      titulo: 'Pago rechazado',
      mensaje: 'Hubo un problema con tu pago. Podés intentarlo de nuevo.',
      color: 'text-neutral-900'
    },
    pending: {
      icono: '○',
      titulo: 'Pago pendiente',
      mensaje: 'Tu pago está siendo procesado. Te avisamos cuando se confirme.',
      color: 'text-neutral-900'
    },
  }

  const actual = config[status] || config.success

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center px-6">
      <div className="bg-white rounded-3xl p-10 max-w-sm w-full text-center">

        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl font-light text-neutral-900">{actual.icono}</span>
        </div>

        <h1 className="text-xl font-semibold text-neutral-900 tracking-tight mb-3">{actual.titulo}</h1>
        <p className="text-sm text-neutral-500 leading-relaxed mb-8">{actual.mensaje}</p>

        <div className="border-t border-neutral-100 pt-6 mb-6">
          <p className="text-xs text-neutral-400 tracking-wide">Envíos a todo el país · Pagos seguros</p>
        </div>

        {status === 'failure' ? (
          <button
            onClick={() => navigate('/carrito')}
            className="w-full bg-neutral-900 text-white py-3.5 rounded-full text-sm font-bold tracking-wide hover:bg-neutral-700 transition-colors"
          >
            Volver al carrito
          </button>
        ) : (
          <button
            onClick={() => navigate('/catalogo')}
            className="w-full bg-neutral-900 text-white py-3.5 rounded-full text-sm font-bold tracking-wide hover:bg-neutral-700 transition-colors"
          >
            Seguir comprando
          </button>
        )}

      </div>
    </div>
  )
}