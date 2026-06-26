import axios from 'axios'

const api = axios.create({
  baseURL: '/api/user',
})

export default api