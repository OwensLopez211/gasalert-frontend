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
  Menu,
  X,
} from 'lucide-react';
import NotificationBell from './NotificationBell';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/reports', icon: <FileText size={20} />, label: 'Reportes' },
  ];

  // Cerrar menú móvil al navegar
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // ... (resto del código de WebSocket y notificaciones)

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setOpenMenu(null);
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
            <button
              onClick={() => handleNavigation('/dashboard')}
              className="flex items-center gap-2 text-left"
            >
              <img
                src="/logo.png"
                alt="Logo GasAlert"
                className="h-16 w-16 object-contain"
              />
              <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#60A5FA] to-[#3B82F6]">
                GasAlert
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-full text-gray-400 hover:text-gray-200 hover:bg-[#1f2227]/50 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex flex-1 justify-center"> {/* Cambiado de justify-center a justify-start */}
            <div className="flex items-start gap-1 bg-[#1a1d21]/50 rounded-full p-1 backdrop-blur-sm">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#2d3137] text-[#60A5FA] shadow-inner'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-[#1f2227]/50'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Actions Section */}
          <div className="hidden lg:flex items-center gap-2 relative">
            {/* Notification Bell and Dropdown */}
            <div className="relative">
              <NotificationBell onClick={() => setDropdownOpen(!isDropdownOpen)} />
              {isDropdownOpen && (
                <NotificationDropdown
                  isOpen={isDropdownOpen}
                  onClose={() => setDropdownOpen(false)}
                />
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setOpenMenu(openMenu === 'profile' ? null : 'profile')}
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
                      onClick={() => handleNavigation('/settings')}
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

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? 'max-h-screen opacity-100'
            : 'max-h-0 opacity-0 pointer-events-none'
        }`}>
          <div className="px-4 py-2 space-y-2 bg-[#1a1d21]/95 backdrop-blur-lg border-t border-[#2d3137]">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-start w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#2d3137] text-[#60A5FA] shadow-inner'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#1f2227]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
            
            <div className="pt-2 border-t border-[#2d3137]">
              <button
                onClick={() => handleNavigation('/settings')}
                className="flex items-start w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-[#1f2227]"
              >
                <div className="flex items-center gap-3">
                  <User size={20} />
                  <span>Configuración</span>
                </div>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-start w-full px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-[#1f2227]"
              >
                <div className="flex items-center gap-3">
                  <User size={20} />
                  <span>Cerrar sesión</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;