import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  User,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import NotificationBell from './NotificationBell';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const navItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/reports', icon: <FileText size={20} />, label: 'Reportes' },
  ];

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

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
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Frosted glass effect background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f1115]/80 to-[#141519]/80 backdrop-blur-xl border-b border-white/[0.08]" />
      
      {/* Navbar content */}
      <div className="relative max-w-[1800px] mx-auto px-4 lg:px-8">
        <div className="h-20 flex items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <button
              onClick={() => handleNavigation('/dashboard')}
              className="flex items-center gap-3 group"
            >
              <img
                src="/logo.png"
                alt="Logo GasAlert"
                className="h-12 w-12 object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <span className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                GasAlert
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-1 justify-center">
            <div className="flex items-center gap-2 bg-white/[0.03] rounded-2xl p-1.5 backdrop-blur-lg border border-white/[0.05]">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                      transition-all duration-300 ease-out
                      ${isActive 
                        ? 'bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-500/[0.15] border border-blue-500/20' 
                        : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.05] border border-transparent'
                      }
                    `}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Actions Section */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <NotificationBell 
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                className="p-2 rounded-xl hover:bg-white/[0.05] transition-colors"
              />
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
                className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-300 hover:text-gray-100 hover:bg-white/[0.05] border border-white/[0.05] transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <User size={16} className="text-white" />
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${openMenu === 'profile' ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              {openMenu === 'profile' && (
                <div className="absolute right-0 mt-2 w-56 p-1.5 bg-[#1a1d21]/95 backdrop-blur-xl rounded-xl border border-white/[0.05] shadow-xl shadow-black/20">
                  <button
                    onClick={() => handleNavigation('/settings')}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-300 hover:text-gray-100 rounded-lg hover:bg-white/[0.05] transition-colors"
                  >
                    <User size={16} className="text-gray-400" />
                    <span>Configuración</span>
                  </button>
                  <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-red-400 hover:text-red-300 rounded-lg hover:bg-red-500/10 transition-colors"
                  >
                    <User size={16} />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-gray-200 hover:bg-white/[0.05] border border-white/[0.05] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`
            lg:hidden absolute left-0 right-0 top-full bg-[#1a1d21]/95 backdrop-blur-xl border-t border-white/[0.05]
            transition-all duration-300 ease-in-out overflow-hidden
            ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium
                    transition-all duration-300 ease-out
                    ${isActive 
                      ? 'bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-500/[0.15] border border-blue-500/20'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.05] border border-transparent'
                    }
                  `}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent my-2" />
            
            <button
              onClick={() => handleNavigation('/settings')}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-white/[0.05] border border-transparent transition-colors"
            >
              <User size={20} />
              <span>Configuración</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent transition-colors"
            >
              <User size={20} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;