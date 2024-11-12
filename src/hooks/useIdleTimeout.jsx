import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

export const useIdleTimeout = (timeout = 1800000) => { // 30 minutos por defecto
  const [isIdle, setIsIdle] = useState(false);
  const { logout } = useAuth();

  const handleUserActivity = useCallback(() => {
    setIsIdle(false);
    localStorage.setItem('lastActivity', Date.now().toString());
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

    const checkIdle = setInterval(() => {
      const lastActivity = parseInt(localStorage.getItem('lastActivity') || Date.now().toString());
      const timeSinceLastActivity = Date.now() - lastActivity;

      if (timeSinceLastActivity >= timeout) {
        setIsIdle(true);
        logout();
        clearInterval(checkIdle);
      }
    }, 1000);

    events.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });

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