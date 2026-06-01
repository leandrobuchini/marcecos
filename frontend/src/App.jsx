import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Inicio from './pages/Inicio'
import Catalogo from './pages/Catalogo'
import AdminLogin from './pages/AdminLogin'
import Carrito from './pages/Carrito'
import AdminPanel from './pages/AdminPanel'
import RutaProtegida from './components/RutaProtegida'
import Detalle from './pages/Detalle'
import Confirmacion from './pages/Confirmacion'
import Registro from './pages/Registro'
import Login from './pages/Login'
import Perfil from './pages/Perfil'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/producto/:id" element={<Detalle />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/confirmacion" element={<Confirmacion />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/panel" element={
          <RutaProtegida>
            <AdminPanel />
          </RutaProtegida>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App