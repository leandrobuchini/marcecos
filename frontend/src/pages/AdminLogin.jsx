import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      navigate('/admin/panel')
    } catch {
      setError('Email o contraseña incorrectos')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-80">
        
        {/* Icono candado */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-3xl">🔒</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800">Admin Login</h2>
        <p className="text-center text-gray-400 text-sm mb-6">Acceso exclusivo para Marcecos</p>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-3 outline-none text-sm"
        />

        {/* Contraseña */}
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 outline-none text-sm"
        />

        {/* Error */}
        {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}

        {/* Botón */}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all"
        >
          INGRESAR
        </button>

        <p className="text-center text-gray-400 text-xs mt-4">Acceso para personal autorizado</p>
      </div>
    </div>
  )
}

export default AdminLogin