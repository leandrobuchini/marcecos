import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useCarrito } from '../context/CarritoContext'

export default function Catalogo() {
  const [productos, setProductos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [categoriaActiva, setCategoriaActiva] = useState('Todos')
  const [precioMin, setPrecioMin] = useState('')
  const [precioMax, setPrecioMax] = useState('')
  const [orden, setOrden] = useState('')
  const [mostrarFiltros, setMostrarFiltros] = useState(false)
  const navigate = useNavigate()
  const { agregarAlCarrito, cantidadItems } = useCarrito()

  const categorias = ['Todos', 'Juegos', 'Maderas', 'Bebes', 'Exterior', 'Educativos']

  useEffect(() => {
    api.get('/productos')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : []
        setProductos(data)
      })
      .catch(err => console.log(err))
  }, [])

  const productosFiltrados = productos
    .filter(p => {
      const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase())
      const coincideCategoria = categoriaActiva === 'Todos' || p.categoria === categoriaActiva
      const coincidePrecioMin = precioMin === '' || Number(p.precio) >= Number(precioMin)
      const coincidePrecioMax = precioMax === '' || Number(p.precio) <= Number(precioMax)
      return coincideBusqueda && coincideCategoria && coincidePrecioMin && coincidePrecioMax
    })
    .sort((a, b) => {
      if (orden === 'menor') return Number(a.precio) - Number(b.precio)
      if (orden === 'mayor') return Number(b.precio) - Number(a.precio)
      return 0
    })

  return (
    <div className="min-h-screen bg-neutral-50">

      {/* Navbar */}
      <div className="bg-white border-b border-neutral-100 px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-lg font-semibold tracking-tight text-neutral-900">Marcecos</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin')}
            className="text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Admin
          </button>
          <button
            onClick={() => navigate('/carrito')}
            className="relative w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
          >
            <span className="text-base">🛒</span>
            {cantidadItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-neutral-900 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                {cantidadItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Hero banner */}
      <div className="bg-neutral-900 px-6 py-8">
        <p className="text-neutral-500 text-xs tracking-widest uppercase mb-2">Destacados</p>
        <h2 className="text-white text-2xl font-semibold tracking-tight mb-4">Nueva colección disponible</h2>
        <button className="bg-white text-neutral-900 text-xs font-bold tracking-widest uppercase px-5 py-2 rounded-full hover:bg-neutral-100 transition-colors">
          Ver todo
        </button>
      </div>

      {/* Buscador */}
      <div className="px-4 pt-4 flex gap-2">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="flex-1 bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-neutral-400 transition-colors"
        />
        <button
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${mostrarFiltros ? 'bg-neutral-900 border-neutral-900 text-white' : 'bg-white border-neutral-200 text-neutral-500'}`}
        >
          ⚙️
        </button>
      </div>

      {/* Filtros avanzados */}
      {mostrarFiltros && (
        <div className="mx-4 mt-3 bg-white border border-neutral-200 rounded-xl p-4 flex flex-col gap-3">
          <p className="text-xs font-semibold text-neutral-900 tracking-wide uppercase">Filtros</p>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Precio mín"
              value={precioMin}
              onChange={e => setPrecioMin(e.target.value)}
              className="flex-1 border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none"
            />
            <input
              type="number"
              placeholder="Precio máx"
              value={precioMax}
              onChange={e => setPrecioMax(e.target.value)}
              className="flex-1 border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none"
            />
          </div>
          <select
            value={orden}
            onChange={e => setOrden(e.target.value)}
            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none"
          >
            <option value="">Sin orden</option>
            <option value="menor">Menor a mayor precio</option>
            <option value="mayor">Mayor a menor precio</option>
          </select>
          <button
            onClick={() => { setPrecioMin(''); setPrecioMax(''); setOrden('') }}
            className="text-sm text-neutral-400 hover:text-neutral-900 transition-colors text-left"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {/* Categorías */}
      <div className="flex gap-2 px-4 mt-4 overflow-x-auto pb-1 scrollbar-hide">
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoriaActiva(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              categoriaActiva === cat
                ? 'bg-neutral-900 text-white'
                : 'bg-white text-neutral-500 border border-neutral-200 hover:border-neutral-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Productos */}
      <div className="px-4 mt-5 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold text-neutral-900 tracking-widest uppercase">Productos</h3>
          <span className="text-xs text-neutral-400">{productosFiltrados.length} resultados</span>
        </div>

        {productosFiltrados.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-neutral-400 text-sm">No hay productos todavía</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {productosFiltrados.map(producto => (
              <div
                key={producto.id}
                className="bg-white rounded-2xl overflow-hidden border border-neutral-100 cursor-pointer hover:border-neutral-300 transition-all"
                onClick={() => navigate(`/producto/${producto.id}`)}
              >
                <div className="bg-neutral-50 h-36 flex items-center justify-center">
                  {producto.imagen
                    ? <img src={producto.imagen} alt={producto.nombre} className="h-full w-full object-cover" />
                    : <span className="text-neutral-300 text-sm">Sin imagen</span>
                  }
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-neutral-900 mb-1 truncate">{producto.nombre}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-neutral-900">${Number(producto.precio).toLocaleString()}</p>
                      <span className="text-xs text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded-full">{producto.categoria}</span>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); agregarAlCarrito(producto) }}
                      className="w-7 h-7 bg-neutral-900 text-white rounded-full flex items-center justify-center text-lg hover:bg-neutral-700 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}