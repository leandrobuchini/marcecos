import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Registro() {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleRegistro = async () => {
    if (!nombre || !email || !password) {
      setError('Completá todos los campos')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    setCargando(true)
    try {
      const res = await api.post('/clientes/registrar', { nombre, email, password })
      localStorage.setItem('cliente_token', res.data.token)
      localStorage.setItem('cliente', JSON.stringify(res.data.cliente))
      navigate('/catalogo')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear la cuenta')
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl p-10 w-full max-w-sm">

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">Crear cuenta</h1>
          <p className="text-sm text-neutral-400 mt-1">Marcecos — Registrate gratis</p>
        </div>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Tu nombre"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-neutral-400 transition-colors"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-neutral-400 transition-colors"
          />
          <input
            type="password"
            placeholder="Contraseña (mínimo 6 caracteres)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleRegistro()}
            className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-neutral-400 transition-colors"
          />
        </div>

        {error && <p className="text-xs text-red-400 mt-3">{error}</p>}

        <button
          onClick={handleRegistro}
          disabled={cargando}
          className="w-full bg-neutral-900 text-white py-3.5 rounded-full text-sm font-bold tracking-wide hover:bg-neutral-700 transition-colors mt-6 disabled:opacity-50"
        >
          {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>

        <p className="text-center text-sm text-neutral-400 mt-6">
          ¿Ya tenés cuenta?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-neutral-900 font-medium hover:underline"
          >
            Iniciá sesión
          </button>
        </p>

      </div>
    </div>
  )
}