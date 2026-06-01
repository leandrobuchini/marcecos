import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Perfil() {
  const navigate = useNavigate()
  const [cliente, setCliente] = useState(null)
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [direccion, setDireccion] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)
  const [pedidos, setPedidos] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('cliente_token')
    if (!token) {
      navigate('/login')
      return
    }
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    api.get('/clientes/perfil')
      .then(res => {
        setCliente(res.data)
        setNombre(res.data.nombre || '')
        setTelefono(res.data.telefono || '')
        setDireccion(res.data.direccion || '')
        setCiudad(res.data.ciudad || '')
      })
      .catch(() => navigate('/login'))

      api.get('/clientes/pedidos')
  .then(res => setPedidos(Array.isArray(res.data) ? res.data : []))
  .catch(() => {})
  }, [])

  const handleGuardar = async () => {
    setCargando(true)
    try {
      await api.put('/clientes/perfil', { nombre, telefono, direccion, ciudad })
      localStorage.setItem('cliente', JSON.stringify({ ...cliente, nombre, telefono, direccion, ciudad }))
      setMensaje('Perfil actualizado!')
      setTimeout(() => setMensaje(''), 3000)
    } catch {
      setMensaje('Error al guardar')
    }
    setCargando(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('cliente_token')
    localStorage.removeItem('cliente')
    navigate('/catalogo')
  }

  if (!cliente) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <p className="text-neutral-400 text-sm">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">

      {/* Header */}
      <div className="bg-neutral-950 px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-white text-base font-semibold tracking-tight">Mi perfil</h1>
          <p className="text-neutral-500 text-xs mt-0.5">{cliente.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-neutral-500 text-sm hover:text-neutral-300 transition-colors"
        >
          Salir
        </button>
      </div>

      {/* Avatar */}
      <div className="bg-neutral-950 pb-8 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-3">
          <span className="text-2xl font-bold text-neutral-900">
            {cliente.nombre?.charAt(0).toUpperCase()}
          </span>
        </div>
        <p className="text-white font-medium">{cliente.nombre}</p>
        <p className="text-neutral-500 text-xs mt-1">Cliente desde {new Date(cliente.creado_en).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}</p>
      </div>

      {/* Formulario */}
      <div className="px-4 py-6 flex flex-col gap-3 max-w-md mx-auto">
        <p className="text-xs font-semibold text-neutral-900 tracking-widest uppercase mb-2">Datos personales</p>

        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          className="w-full border border-neutral-200 bg-white rounded-xl px-4 py-3 text-sm outline-none focus:border-neutral-400 transition-colors"
        />
        <input
          type="tel"
          placeholder="Teléfono"
          value={telefono}
          onChange={e => setTelefono(e.target.value)}
          className="w-full border border-neutral-200 bg-white rounded-xl px-4 py-3 text-sm outline-none focus:border-neutral-400 transition-colors"
        />

        <p className="text-xs font-semibold text-neutral-900 tracking-widest uppercase mt-2 mb-1">Dirección de envío</p>

        <input
          type="text"
          placeholder="Dirección"
          value={direccion}
          onChange={e => setDireccion(e.target.value)}
          className="w-full border border-neutral-200 bg-white rounded-xl px-4 py-3 text-sm outline-none focus:border-neutral-400 transition-colors"
        />
        <input
          type="text"
          placeholder="Ciudad"
          value={ciudad}
          onChange={e => setCiudad(e.target.value)}
          className="w-full border border-neutral-200 bg-white rounded-xl px-4 py-3 text-sm outline-none focus:border-neutral-400 transition-colors"
        />

        {mensaje && <p className="text-xs text-neutral-500 text-center">{mensaje}</p>}

        <button
          onClick={handleGuardar}
          disabled={cargando}
          className="w-full bg-neutral-900 text-white py-3.5 rounded-full text-sm font-bold tracking-wide hover:bg-neutral-700 transition-colors disabled:opacity-50 mt-2"
        >
          {cargando ? 'Guardando...' : 'Guardar cambios'}
        </button>

        <button
          onClick={() => navigate('/catalogo')}
          className="w-full border border-neutral-200 text-neutral-500 py-3 rounded-full text-sm font-medium hover:border-neutral-400 transition-colors"
        >
          Volver al catálogo
        </button>
      </div>
      {/* Historial de pedidos */}
<div className="mt-4">
  <p className="text-xs font-semibold text-neutral-900 tracking-widest uppercase mb-3">Mis pedidos</p>
  {pedidos.length === 0 ? (
    <div className="bg-white rounded-2xl border border-neutral-100 p-6 text-center">
      <p className="text-neutral-400 text-sm">Todavía no realizaste ningún pedido</p>
    </div>
  ) : (
    pedidos.map(pedido => (
      <div key={pedido.id} className="bg-white rounded-2xl border border-neutral-100 p-4 mb-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-neutral-900">Pedido #{pedido.id}</p>
            <p className="text-xs text-neutral-400">
              {new Date(pedido.creado_en).toLocaleDateString('es-AR', {
                day: '2-digit', month: '2-digit', year: 'numeric'
              })}
            </p>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
            pedido.estado === 'pendiente' ? 'bg-amber-50 text-amber-600' :
            pedido.estado === 'enviado' ? 'bg-blue-50 text-blue-600' :
            'bg-green-50 text-green-600'
          }`}>
            {pedido.estado}
          </span>
        </div>
        <div className="flex flex-col gap-1 mb-3">
          {pedido.items.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <span className="text-neutral-500">{item.nombre} x{item.cantidad}</span>
              <span className="text-neutral-900 font-medium">${Number(item.precio * item.cantidad).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between border-t border-neutral-100 pt-2">
          <span className="text-xs text-neutral-500">Total</span>
          <span className="text-sm font-bold text-neutral-900">${Number(pedido.total).toLocaleString()}</span>
        </div>
      </div>
    ))
  )}
</div>

    </div>
  )
}