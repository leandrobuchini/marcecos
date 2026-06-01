import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:4000/api'
})

// Agrega el token automáticamente en cada petición
api.interceptors.request.use((config) => {
  // Token del admin
  const tokenAdmin = localStorage.getItem('token')
  // Token del cliente
  const tokenCliente = localStorage.getItem('cliente_token')

  const token = tokenAdmin || tokenCliente

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api