// frontend/gasalert-frontend/src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = AuthService.getAccessToken();
        if (accessToken) {
          // Aquí puedes hacer una solicitud al backend para obtener los datos del usuario
          // utilizando el token de acceso
          // Ejemplo: const response = await axios.get('/users/me/');
          // const user = response.data;
          // setUser(user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error al verificar la autenticación:', error);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await AuthService.login(username, password);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const authContextValue = {
    user,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};