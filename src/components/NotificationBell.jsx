import React from 'react';
import { BellRing } from 'lucide-react';
import { useNotifications } from '../context/NotificationProvider';

const NotificationBell = ({ onClick }) => {
  const { unreadCount } = useNotifications();

  return (
    <div className="relative">
      <button
        onClick={onClick}
        className="relative p-2 rounded-xl text-gray-400 hover:text-orange-500 hover:bg-gray-800/50 transition-all duration-300"
        aria-label="Notificaciones"
      >
        <div className="relative">
          <BellRing size={20} />
          {unreadCount > 0 && (
            <>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-orange-500 to-orange-600 text-white text-xs font-medium rounded-full flex items-center justify-center border-2 border-gray-950">
                {unreadCount}
              </span>
              <span className="absolute -top-1 -right-1 w-5 h-5 animate-ping bg-orange-500 rounded-full opacity-50" />
            </>
          )}
        </div>
      </button>
    </div>
  );
};

export default NotificationBell;