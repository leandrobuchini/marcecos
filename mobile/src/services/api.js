import axios from 'axios'

const api = axios.create({
  baseURL: 'https://marcecos-backend.onrender.com/api'
})

export default api