import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Inicio from './pages/Inicio'
import Catalogo from './pages/Catalogo'
import AdminLogin from './pages/AdminLogin'
import Carrito from './pages/Carrito'
import AdminPanel from './pages/AdminPanel'
import RutaProtegida from './components/RutaProtegida'
import Confirmacion from './pages/Confirmacion'
import Detalle from './pages/Detalle'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/admin/panel" element={
          <RutaProtegida>
            <AdminPanel />
          </RutaProtegida>
        } />
        <Route path="/confirmacion" element={<Confirmacion />} />
        <Route path="/producto/:id" element={<Detalle />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App