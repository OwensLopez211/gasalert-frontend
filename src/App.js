import React from 'react';
import { 
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import NavigationSidebar from './components/NavigationSidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="flex h-screen bg-slate-100">
      <NavigationSidebar />
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Efecto para manejar redirecciones post-login
  React.useEffect(() => {
    if (isAuthenticated && location.pathname === '/login') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate, location]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="*" 
        element={
          <div className="flex h-screen items-center justify-center">
            <h1 className="text-2xl font-bold text-slate-800">
              404 - Página no encontrada
            </h1>
          </div>
        }
      />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;