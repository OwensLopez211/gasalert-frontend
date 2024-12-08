import React from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../context/NotificationProvider';

const NotificationBell = ({ onClick }) => {
  const { unreadCount } = useNotifications();

  return (
    <div className="relative inline-block">
      <button
        onClick={onClick}
        className="p-2 rounded-full text-gray-400 hover:text-gray-200 hover:bg-[#1f2227]/50"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default NotificationBell;
