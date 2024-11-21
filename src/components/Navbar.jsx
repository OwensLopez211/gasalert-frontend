import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  LayoutDashboard,
  Container,
  Bell,
  Wrench,
  FileText,
  User,
} from 'lucide-react';

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(null); // Estado para controlar cuál menú está abierto
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const navItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/tanks', icon: <Container size={20} />, label: 'Tanques' },
    { path: '/maintenance', icon: <Wrench size={20} />, label: 'Mantenimiento' },
    { path: '/reports', icon: <FileText size={20} />, label: 'Reportes' },
  ];

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          console.error('Token de autenticación no encontrado');
          return;
        }

        const response = await fetch('http://localhost:8000/api/alerts/notificaciones/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener las notificaciones');
        }

        const data = await response.json();
        setNotifications(data);
        const unread = data.filter((n) => !n.leido).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error('Error al obtener las notificaciones:', error);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('Token de autenticación no encontrado');
        return;
      }

      await fetch(`http://localhost:8000/api/alerts/notificaciones/${id}/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, leido: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error al marcar la notificación como leída:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="bg-gradient-to-r from-[#0f1115] to-[#141519] backdrop-blur-lg border-b border-[#1f2227]/50 sticky top-0 z-50">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex items-center justify-between px-4 lg:px-8 h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Logo GasAlert"
              className="h-16 w-16 object-contain"
            />
            <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#60A5FA] to-[#3B82F6]">
              GasAlert
            </span>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex flex-1 justify-center">
            <div className="flex items-center gap-1 bg-[#1a1d21]/50 rounded-full p-1 backdrop-blur-sm">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
                      ${isActive 
                        ? 'bg-[#2d3137] text-[#60A5FA] shadow-inner' 
                        : 'text-gray-400 hover:text-gray-200 hover:bg-[#1f2227]/50'}`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Actions Section */}
          <div className="flex items-center gap-2">

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() =>
                  setOpenMenu(openMenu === 'notifications' ? null : 'notifications')
                }
                className="p-2 rounded-full text-gray-400 hover:text-gray-200 hover:bg-[#1f2227]/50 transition-colors"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-[#3B82F6] text-white text-xs font-bold flex items-center justify-center rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {openMenu === 'notifications' && (
                <div className="absolute right-0 mt-2 w-80 overflow-hidden bg-[#1a1d21] rounded-2xl border border-[#2d3137] shadow-lg">
                  <div className="p-4 border-b border-[#2d3137]">
                    <h3 className="font-semibold text-white">Notificaciones</h3>
                  </div>
                  <div className="max-h-[320px] overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markAsRead(n.id)}
                          className={`p-4 cursor-pointer border-b border-[#2d3137] last:border-none transition-colors
                            ${n.leido 
                              ? 'text-gray-400 hover:bg-[#2d3137]/50' 
                              : 'text-white hover:bg-[#2d3137]'}`}
                        >
                          <p className="text-sm">{n.message}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-gray-400 text-sm text-center">
                        No hay notificaciones
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() =>
                  setOpenMenu(openMenu === 'profile' ? null : 'profile')
                }
                className="ml-2 flex items-center gap-2 px-3 py-1.5 rounded-full text-gray-400 hover:text-gray-200 hover:bg-[#1f2227]/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#60A5FA] to-[#3B82F6] flex items-center justify-center">
                  <User size={18} className="text-white" />
                </div>
              </button>

              {/* Profile Dropdown */}
              {openMenu === 'profile' && (
                <div className="absolute right-0 mt-2 w-48 overflow-hidden bg-[#1a1d21] rounded-2xl border border-[#2d3137] shadow-lg">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        navigate('/settings');
                        setOpenMenu(null);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-[#2d3137] transition-colors"
                    >
                      Configuración
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-400 hover:text-red-300 hover:bg-[#2d3137] transition-colors"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
