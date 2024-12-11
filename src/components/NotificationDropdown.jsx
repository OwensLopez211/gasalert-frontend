import React from 'react';
import { Bell, X, Check, AlertCircle, BellRing } from 'lucide-react';
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

  const getNotificationIcon = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case 'critico':
        return (
          <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
        );
      case 'advertencia':
        return (
          <div className="p-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
          </div>
        );
      default:
        return (
          <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
            <BellRing className="w-5 h-5 text-orange-500" />
          </div>
        );
    }
  };

  return (
    <>
      {/* Overlay para cerrar al hacer clic fuera */}
      <div 
        className="fixed inset-0 z-[9998] bg-black/20 "
        onClick={onClose}
      />
      
      {/* Dropdown */}
      <div className="absolute right-0 top-full mt-2 w-96 z-[99999]">
        <div className="bg-gray-950/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-800/50 overflow-hidden z-[9998]">
          {/* Header */}
          <div className="px-4 py-3 flex items-center justify-between border-b border-gray-800/50 bg-gray-900/50">
            <h3 className="text-white font-semibold text-lg">Notificaciones</h3>
            <button 
              onClick={onClose}
              className="p-1.5 hover:bg-gray-800/50 rounded-xl transition-all duration-300 text-gray-400 hover:text-orange-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Notifications Container */}
          <div className="max-h-[480px] overflow-y-auto custom-scrollbar">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id || `temp-${notification.alerta_id}-${notification.fecha_envio}`}
                  className={`
                    group relative p-4 hover:bg-gray-900/50
                    transition-all duration-300 cursor-pointer
                    ${!notification.fecha_lectura && 'bg-gray-900/20'}
                  `}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.tipo)}
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className={`text-sm font-medium line-clamp-2 ${
                        notification.fecha_lectura ? 'text-gray-400' : 'text-white'
                      }`}>
                        {notification.mensaje}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-xs text-gray-500">
                          {new Date(notification.fecha_envio).toLocaleString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        {notification.fecha_lectura && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Check className="w-3 h-3" />
                            <span>Leída</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {!notification.fecha_lectura && (
                      <span className="absolute top-4 right-4 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-900/50 flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-gray-400 font-medium">No hay notificaciones</p>
                <p className="text-gray-600 text-sm mt-1">Las notificaciones aparecerán aquí</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-800/50 bg-gray-900/50">
              <button
                className="w-full py-2.5 px-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white text-sm font-medium rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
                onClick={onClose}
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationDropdown;