import { useNavigate } from 'react-router-dom'

export default function Inicio() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-between py-20 px-6">

      {/* Logo */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center">
          <span className="text-5xl font-bold text-neutral-950 tracking-tighter">M</span>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-semibold text-white tracking-tight">Marcecos</h1>
          <p className="text-neutral-500 text-xs tracking-widest uppercase mt-1">Juguetería</p>
        </div>
      </div>

      {/* Bienvenida */}
      <div className="text-center">
        <p className="text-white text-2xl font-medium">Bienvenido</p>
        <p className="text-neutral-600 text-sm mt-1">Welcome</p>
      </div>

      {/* Botón */}
      <button
        onClick={() => navigate('/catalogo')}
        className="bg-white text-neutral-950 px-16 py-4 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-neutral-100 transition-all"
      >
        Iniciar
      </button>

    </div>
  )
}