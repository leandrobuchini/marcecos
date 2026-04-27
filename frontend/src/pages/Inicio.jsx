import { useNavigate } from 'react-router-dom'

function Inicio() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-between py-20">
      
      {/* Logo */}
      <div className="flex flex-col items-center gap-6">
        <div className="w-40 h-40 bg-red-500 rounded-full flex items-center justify-center shadow-2xl">
          <span className="text-white text-3xl font-bold">M</span>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">Marcecos</h1>
          <p className="text-gray-400 mt-2 text-lg">Juguetería</p>
        </div>
      </div>

      {/* Bienvenida */}
      <div className="text-center">
        <p className="text-white text-2xl font-semibold">Bienvenido</p>
        <p className="text-gray-400 text-lg">Welcome</p>
      </div>

      {/* Botón */}
      <button
        onClick={() => navigate('/catalogo')}
        className="bg-blue-600 text-white px-16 py-4 rounded-full text-lg font-bold hover:bg-blue-700 transition-all shadow-lg"
      >
        INICIAR
      </button>

    </div>
  )
}

export default Inicio