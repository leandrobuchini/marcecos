import { createContext, useContext, useState } from 'react'

const CarritoContext = createContext()

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState([])

  const agregarAlCarrito = (producto) => {
  setCarrito(prev => {
    const existe = prev.find(p => p.id === producto.id)
    if (existe) {
      return prev.map(p => p.id === producto.id
        ? { ...p, cantidad: p.cantidad + (producto.cantidad || 1) }
        : p
      )
    }
    return [...prev, { ...producto, cantidad: producto.cantidad || 1 }]
  })
}

  const cambiarCantidad = (id, valor) => {
    setCarrito(prev =>
      prev.map(p => p.id === id
        ? { ...p, cantidad: Math.max(1, p.cantidad + valor) }
        : p
      )
    )
  }

  const eliminarDelCarrito = (id) => {
    setCarrito(prev => prev.filter(p => p.id !== id))
  }

  const vaciarCarrito = () => setCarrito([])

  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0)
  const cantidadItems = carrito.reduce((acc, p) => acc + p.cantidad, 0)

  return (
    <CarritoContext.Provider value={{
      carrito,
      agregarAlCarrito,
      cambiarCantidad,
      eliminarDelCarrito,
      vaciarCarrito,
      total,
      cantidadItems
    }}>
      {children}
    </CarritoContext.Provider>
  )
}
// eslint-disable-next-line react-refresh/only-export-components
export function useCarrito() {
  return useContext(CarritoContext)
}