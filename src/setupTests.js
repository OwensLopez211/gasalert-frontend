// frontend/gasalert-frontend/src/setupTests.js

import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000/api/'; // Reemplaza con la URL de tu backend de Django

// Interceptor para incluir el token de acceso en las solicitudes
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar la expiración del token y la actualización del token
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Lógica para manejar la expiración del token y la actualización del token
    // ...
  }
);