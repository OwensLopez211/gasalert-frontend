import React, { useState, useEffect } from 'react';
import { AlertCircle, BellRing, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationToast = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Esperar a que termine la animación
    }, 5000); // La notificación se ocultará después de 5 segundos

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case 'critico':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'advertencia':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <BellRing className="w-5 h-5 text-orange-500" />;
    }
  };

  const getBorderColor = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case 'critico':
        return 'border-l-red-500';
      case 'advertencia':
        return 'border-l-yellow-500';
      default:
        return 'border-l-orange-500';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -20, x: 20 }}
          className={`fixed top-20 right-4 z-[9999] max-w-md bg-gray-950/95 backdrop-blur-xl rounded-lg shadow-2xl border border-gray-800/50 ${getBorderColor(notification.tipo)} border-l-4`}
        >
          <div className="flex items-start gap-3 p-4 pr-12">
            <div className={`flex-shrink-0 p-2 rounded-xl ${
              notification.tipo?.toLowerCase() === 'critico' ? 'bg-red-500/10' :
              notification.tipo?.toLowerCase() === 'advertencia' ? 'bg-yellow-500/10' :
              'bg-orange-500/10'
            }`}>
              {getIcon(notification.tipo)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white line-clamp-2">
                {notification.mensaje}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {new Date(notification.fecha_envio).toLocaleString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-800/50 text-gray-400 hover:text-orange-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationToast;