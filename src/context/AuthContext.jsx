import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Configura el tiempo de inactividad (en milisegundos)
  const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutos

  const handleLogout = useCallback(() => {
    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login', { 
      replace: true,
      state: { message: 'Su sesión ha expirado por inactividad' }
    });
  }, [navigate]);

  // Manejo de actividad del usuario
  useEffect(() => {
    if (!isAuthenticated) return;

    const updateLastActivity = () => {
      localStorage.setItem('lastActivity', Date.now().toString());
    };

    const checkInactivity = setInterval(() => {
      const lastActivity = parseInt(localStorage.getItem('lastActivity') || Date.now().toString());
      if (Date.now() - lastActivity >= IDLE_TIMEOUT) {
        handleLogout();
      }
    }, 1000);

    // Eventos a monitorear
    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
      'keypress'
    ];

    // Agregar event listeners
    events.forEach(event => {
      window.addEventListener(event, updateLastActivity);
    });

    // Establecer actividad inicial
    updateLastActivity();

    // Cleanup
    return () => {
      clearInterval(checkInactivity);
      events.forEach(event => {
        window.removeEventListener(event, updateLastActivity);
      });
    };
  }, [isAuthenticated, IDLE_TIMEOUT, handleLogout]);

  const initializeAuth = useCallback(async () => {
    try {
      AuthService.setupAxiosInterceptors();
      const storedUser = AuthService.getCurrentUser();
      const token = AuthService.getAccessToken();
      
      if (storedUser && token) {
        const lastActivity = parseInt(localStorage.getItem('lastActivity') || '0');
        const timeSinceLastActivity = Date.now() - lastActivity;
        
        if (timeSinceLastActivity >= IDLE_TIMEOUT) {
          handleLogout();
        } else {
          setUser(storedUser);
          setIsAuthenticated(true);
        }
      }
    } catch (err) {
      console.error('Error initializing auth:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [IDLE_TIMEOUT, handleLogout]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = async (username, password) => {
    try {
      setError(null);
      setIsLoading(true);
      const userData = await AuthService.login(username, password);
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('lastActivity', Date.now().toString());
      return true;
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };


  const clearError = () => setError(null);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout: handleLogout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};