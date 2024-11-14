import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

export const useIdleTimeout = (timeout = 1800000) => { // 30 minutos por defecto
  const [isIdle, setIsIdle] = useState(false);
  const { logout } = useAuth();

  const handleUserActivity = useCallback(() => {
    setIsIdle(false);
    sessionStorage.setItem('lastActivity', Date.now().toString());
  }, []);

  useEffect(() => {
    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
      'keypress'
    ];

    // Configuración de `checkIdle`
    const checkIdle = setInterval(() => {
      const lastActivity = parseInt(sessionStorage.getItem('lastActivity') || Date.now().toString());
      const timeSinceLastActivity = Date.now() - lastActivity;

      if (timeSinceLastActivity >= timeout) {
        setIsIdle(true);
        logout();
      }
    }, 1000);

    // Agregar event listeners para detectar actividad del usuario
    events.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });

    // Limpieza al desmontar el componente
    return () => {
      clearInterval(checkIdle);
      events.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [handleUserActivity, logout, timeout]);

  return isIdle;
};

export default useIdleTimeout;
