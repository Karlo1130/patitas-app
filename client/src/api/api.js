import axios from 'axios';

const api = axios.create({
 // url base
    baseURL: 'http://localhost:5000/',
});

api.interceptors.request.use((config) => {
 const token = localStorage.getItem('accessToken');
 if (token) {
  config.headers['Authorization'] = `Bearer ${token}`;
 }
 return config;
}, (error) => {
 return Promise.reject(error);
});

export default api;
