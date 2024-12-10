import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const AuthService = {
  login: async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login/`, {
        username,
        password,
      });
      
      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        
        // Configurar el token en los headers de axios para futuras peticiones
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
        
        // Obtener información del usuario
        const userResponse = await axios.get(`${API_URL}/users/me/`);
        const userData = userResponse.data;
        
        // Obtener las estaciones a las que tiene acceso el usuario
        const stationResponse = await axios.get(`${API_URL}/estaciones/`, {
          headers: {
            Authorization: `Bearer ${response.data.access}`,
          },
        });
        userData.estaciones = stationResponse.data;

        // Guardar la información del usuario y estaciones en localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        
        return userData;
      }
      
      return null;
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data || { message: 'Error en el servidor' };
    }
  },


  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getAccessToken: () => {
    return localStorage.getItem('access_token');
  },

  getRefreshToken: () => {
    return localStorage.getItem('refresh_token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },
  
  // Configurar interceptor para refrescar el token
  setupAxiosInterceptors: () => {
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const refreshToken = AuthService.getRefreshToken();
            const response = await axios.post(`${API_URL}/auth/refresh/`, {
              refresh: refreshToken
            });
            
            const { access } = response.data;
            localStorage.setItem('access_token', access);
            axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
            originalRequest.headers['Authorization'] = `Bearer ${access}`;
            
            return axios(originalRequest);
          } catch (refreshError) {
            AuthService.logout();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }
};

export default AuthService;