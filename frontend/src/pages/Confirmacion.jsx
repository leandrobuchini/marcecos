import { useNavigate } from 'react-router-dom'

function Confirmacion() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">

        {/* Icono */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✅</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Pedido confirmado!</h1>
        <p className="text-gray-500 text-sm mb-2">Gracias por tu compra en Marcecos</p>
        <p className="text-gray-400 text-xs mb-8">Nos vamos a contactar a la brevedad para coordinar el envío</p>

        {/* Línea separadora */}
        <div className="border-t border-gray-200 pt-6 mb-6">
          <p className="text-xs text-gray-400">ENVÍOS A TODO EL PAÍS · PAGOS 100% SEGUROS</p>
        </div>

        <button
          onClick={() => navigate('/catalogo')}
          className="w-full bg-blue-600 text-white py-3 rounded-full font-bold hover:bg-blue-700 transition-all"
        >
          Seguir comprando
        </button>

      </div>
    </div>
  )
}

export default Confirmacion