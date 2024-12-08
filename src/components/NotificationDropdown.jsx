import React, { useEffect } from 'react';
import { useNotifications } from '../context/NotificationProvider';

const NotificationDropdown = ({ isOpen, onClose }) => {
    const { notifications, markAsRead } = useNotifications();
  
    if (!isOpen) return null;
  
    const handleNotificationClick = async (notificationId) => {
      try {
        await markAsRead(notificationId);
      } catch (error) {
        console.error('Error al marcar como leída:', error);
      }
    };
  
    return (
      <div className="absolute right-0 mt-2 w-96 bg-[#1a1d21] rounded-lg shadow-lg z-50 border border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-white font-semibold text-lg">Notificaciones</h3>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id || `temp-${notification.alerta_id}-${notification.fecha_envio}`}
                className={`p-4 transition-all duration-300 cursor-pointer ${
                  notification.fecha_lectura
                    ? 'bg-[#1a1d21] hover:bg-gray-800'
                    : 'bg-[#2d3137] hover:bg-[#3a3f47]'
                }`}
                onClick={() => handleNotificationClick(notification.id)}
              >
                <p className={`text-sm font-medium ${
                  notification.fecha_lectura ? 'text-gray-400' : 'text-white'
                }`}>
                  {notification.mensaje}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(notification.fecha_envio).toLocaleString('es-ES')}
                </p>
                {!notification.fecha_lectura && (
                  <span className="mt-2 inline-block text-xs font-medium text-yellow-400">
                    Nueva
                  </span>
                )}
              </div>
            ))
          ) : (
            <p className="p-4 text-gray-400 text-center">No hay notificaciones</p>
          )}
        </div>
        <div className="p-4 border-t border-gray-700 text-center">
          <button
            className="text-sm text-blue-500 hover:text-blue-400 transition-all"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  };

export default NotificationDropdown;