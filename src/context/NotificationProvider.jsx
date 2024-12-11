import React, { createContext, useContext, useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL;
const WS_URL = process.env.REACT_APP_WS_URL;

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Cargar notificaciones iniciales
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          console.error('Token no encontrado');
          return;
        }
  
        const response = await fetch(`${API_URL}/alerts/notificaciones/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener las notificaciones');
        }

        const data = await response.json();
        console.log('Notificaciones iniciales cargadas:', data);

        setNotifications(data);
        const unreadCount = data.filter(notif => !notif.fecha_lectura).length;
        setUnreadCount(unreadCount);
      } catch (error) {
        console.error('Error cargando notificaciones:', error);
      }
    };

    fetchNotifications();
  }, []);

  // Configuración del WebSocket
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    const socket = new WebSocket(`${WS_URL}/alerts/?token=${token}`);

    socket.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      console.log('Nueva notificación recibida:', newNotification);
    
      setNotifications(prev => {
        // Verificación más estricta basada en el ID de la alerta
        const isDuplicate = prev.some(n => n.alerta_id === newNotification.alerta_id);
    
        if (isDuplicate) {
          console.log('Notificación duplicada detectada, ignorando. ID:', newNotification.alerta_id);
          return prev;
        }
    
        const formattedNotification = {
          id: newNotification.id,
          alerta_id: newNotification.alerta_id, // Asegurarnos de incluir el alerta_id
          mensaje: newNotification.mensaje || `Alerta: ${newNotification.tipo} en Tanque ${newNotification.tanque_id}`,
          fecha_envio: newNotification.fecha_envio || new Date().toISOString(),
          fecha_lectura: null,
          tipo: newNotification.tipo,
          nivel_detectado: newNotification.nivel_detectado,
          umbral: newNotification.umbral,
          tanque_id: newNotification.tanque_id
        };
    
        // Solo incrementar el contador si es una nueva notificación
        setUnreadCount(prevCount => prevCount + 1);
        
        return [formattedNotification, ...prev];
      });
    };

    socket.onerror = (error) => {
      console.error('Error en WebSocket:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket desconectado');
      // Intentar reconectar después de un tiempo
      setTimeout(() => {
        console.log('Intentando reconectar WebSocket...');
      }, 5000);
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  const markAsRead = async (notificationId) => {
    if (!notificationId) {
      console.error('ID de notificación no proporcionado');
      return;
    }

    // Verificar si ya está leída
    const notification = notifications.find(n => n.id === notificationId);
    if (notification?.fecha_lectura) {
      console.log('La notificación ya está marcada como leída');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Token de autenticación no encontrado');
      }

      const response = await fetch(`${API_URL}/alerts/notificaciones/${notificationId}/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fecha_lectura: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Error al marcar la notificación como leída');
      }

      const updatedNotification = await response.json();
      console.log('Notificación actualizada:', updatedNotification);

      // Actualizar el estado local
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId
            ? { ...notif, fecha_lectura: new Date().toISOString() }
            : notif
        )
      );

      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error al marcar como leída:', error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);

export default NotificationContext;