import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleLogin = async () => {
    setCargando(true)
    try {
      const res = await api.post('/clientes/login', { email, password })
      localStorage.setItem('cliente_token', res.data.token)
      localStorage.setItem('cliente', JSON.stringify(res.data.cliente))
      navigate('/catalogo')
    } catch {
      setError('Email o contraseña incorrectos')
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl p-10 w-full max-w-sm">

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">Iniciar sesión</h1>
          <p className="text-sm text-neutral-400 mt-1">Marcecos — Bienvenido de vuelta</p>
        </div>

        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-neutral-400 transition-colors"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-neutral-400 transition-colors"
          />
        </div>

        {error && <p className="text-xs text-red-400 mt-3">{error}</p>}

        <button
          onClick={handleLogin}
          disabled={cargando}
          className="w-full bg-neutral-900 text-white py-3.5 rounded-full text-sm font-bold tracking-wide hover:bg-neutral-700 transition-colors mt-6 disabled:opacity-50"
        >
          {cargando ? 'Ingresando...' : 'Iniciar sesión'}
        </button>

        <p className="text-center text-sm text-neutral-400 mt-6">
          ¿No tenés cuenta?{' '}
          <button
            onClick={() => navigate('/registro')}
            className="text-neutral-900 font-medium hover:underline"
          >
            Registrate
          </button>
        </p>

      </div>
    </div>
  )
}