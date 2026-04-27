import axios from 'axios'

//Direccion del backend
const api = axios.create({
    baseURL: 'https://marcecos-backend.onrender.com/api'
})

// Esto agrega el token automaticamente en cada peticion
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default api