import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard,
  Container,
  Bell,
  Wrench,
  FileText,
  Settings,
  LogOut
} from 'lucide-react';

const NavigationSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const navItems = [
    {
      path: '/dashboard',
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard'
    },
    {
      path: '/tanks',
      icon: <Container size={20} />,
      label: 'Tanques'
    },
    {
      path: '/alerts',
      icon: <Bell size={20} />,
      label: 'Alertas'
    },
    {
      path: '/maintenance',
      icon: <Wrench size={20} />,
      label: 'Mantenimiento'
    },
    {
      path: '/reports',
      icon: <FileText size={20} />,
      label: 'Reportes'
    },
    {
      path: '/settings',
      icon: <Settings size={20} />,
      label: 'Configuración'
    }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-screen w-64 bg-slate-800 text-white p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">GasAlert</h1>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-3 px-4 py-2 w-full rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-slate-700 text-white' 
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-700 pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 w-full text-left text-slate-300 
                   hover:bg-slate-700 hover:text-white rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
};

export default NavigationSidebar;