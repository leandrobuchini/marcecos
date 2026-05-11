import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useCarrito } from '../context/CarritoContext'

function Catalogo() {
  const [productos, setProductos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const navigate = useNavigate()
  const { agregarAlCarrito, cantidadItems } = useCarrito()
  const [categoriaActiva, setCategoriaActiva] = useState('todos')
  const [precioMin, setPrecioMin] = useState('')
  const [precioMax, setPrecioMax] = useState('')
  const [soloConStock, setSoloConStock] = useState(false)
  const [orden, setOrden] = useState('') 
  const [mostrarFiltros, setMostrarFiltros] = useState(false)

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
    const coincideStock = !soloConStock || p.stock > 0
    return coincideBusqueda && coincideCategoria && coincidePrecioMin && coincidePrecioMax && coincideStock
  })
  .sort((a, b) => {
    if (orden === 'menor') return Number(a.precio) - Number(b.precio)
    if (orden === 'mayor') return Number(b.precio) - Number(a.precio)
    return 0
  })

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <div className="bg-white shadow px-4 py-3 flex items-center justify-between">
        <span className="text-2xl">☰</span>
        <span className="font-bold text-gray-800">Marcecos</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/admin')}
            className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full"
          >
            Admin
          </button>
          <button
            onClick={() => navigate('/carrito')}
            className="relative"
          >
            🛒
            {cantidadItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cantidadItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Banner ofertas */}
      <div className="bg-gray-300 mx-4 mt-4 rounded-xl h-24 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-600">OFERTAS</span>
      </div>
      {/* Categorías */}
<div className="flex gap-2 px-4 mt-4 overflow-x-auto pb-2">
  {['Todos', 'Juegos', 'Maderas', 'Bebes', 'Exterior', 'Educativos'].map(cat => (
    <button
      key={cat}
      onClick={() => setCategoriaActiva(cat)}
      className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all
        ${categoriaActiva === cat
          ? 'bg-blue-600 text-white'
          : 'bg-white text-gray-600 border border-gray-300'
        }`}
    >
      {cat}
    </button>
  ))}
</div>

      {/* Buscador */}
      <div className="mx-4 mt-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Búsqueda"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm outline-none"
        />
        <button 
  onClick={() => setMostrarFiltros(!mostrarFiltros)}
  className={`p-2 rounded-full ${mostrarFiltros ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 border border-gray-300'}`}
>
  ⚙️
</button>
{/* Panel de filtros */}
{mostrarFiltros && (
  <div className="mx-4 mt-3 bg-white rounded-xl shadow p-4 flex flex-col gap-3">
    
    <p className="font-semibold text-gray-700 text-sm">Filtros avanzados</p>

    {/* Rango de precio */}
    <div>
      <p className="text-xs text-gray-500 mb-2">Rango de precio</p>
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Mín $"
          value={precioMin}
          onChange={e => setPrecioMin(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
        />
        <input
          type="number"
          placeholder="Máx $"
          value={precioMax}
          onChange={e => setPrecioMax(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
        />
      </div>
    </div>

    {/* Ordenar por precio */}
    <div>
      <p className="text-xs text-gray-500 mb-2">Ordenar por precio</p>
      <select
        value={orden}
        onChange={e => setOrden(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
      >
        <option value="">Sin orden</option>
        <option value="menor">Menor a mayor</option>
        <option value="mayor">Mayor a menor</option>
      </select>
    </div>

    {/* Solo con stock */}
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-700">Solo productos con stock</p>
      <button
        onClick={() => setSoloConStock(!soloConStock)}
        className={`w-12 h-6 rounded-full transition-all ${soloConStock ? 'bg-blue-600' : 'bg-gray-300'}`}
      >
        <div className={`w-5 h-5 bg-white rounded-full shadow transition-all mx-0.5 ${soloConStock ? 'translate-x-6' : 'translate-x-0'}`} />
      </button>
    </div>

    {/* Limpiar filtros */}
    <button
      onClick={() => { setPrecioMin(''); setPrecioMax(''); setSoloConStock(false); setOrden('') }}
      className="w-full border border-gray-300 text-gray-500 py-2 rounded-lg text-sm"
    >
      Limpiar filtros
    </button>

  </div>
)}
      </div>

      {/* Productos */}
      <div className="px-4 mt-6 pb-6">
        {productosFiltrados.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">No hay productos todavía</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {productosFiltrados.map(producto => (
              <div
                key={producto.id}
                className="bg-white rounded-xl shadow p-3 cursor-pointer"
                onClick={() => navigate(`/producto/${producto.id}`)}
              >
                <div className="bg-gray-200 rounded-lg h-32 flex items-center justify-center mb-2">
                  {producto.imagen
                    ? <img src={producto.imagen} alt={producto.nombre} className="h-full w-full object-cover rounded-lg" />
                    : <span className="text-gray-400 text-sm">Sin imagen</span>
                  }
                </div>
                <p className="text-sm font-semibold text-gray-700">{producto.nombre}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-red-500 font-bold text-sm">${Number(producto.precio).toLocaleString()}</span>
                  <button
                    onClick={e => { e.stopPropagation(); agregarAlCarrito(producto) }}
                    className="bg-gray-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default Catalogo