import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginErrorNotification from '../components/LoginErrorNotification';
import { ShieldCheck, User, Lock, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, error, isAuthenticated, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const inactivityMessage = location.state?.message;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      console.error('Error en login:', err);
    } finally {
      if (!error) setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950/50 via-gray-950/80 to-gray-950/90" />

      <div className="relative flex min-h-screen flex-col">
        <header className="flex items-center justify-center px-6 py-8">
          <div className="flex flex-col items-center gap-3">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-[2px] shadow-lg shadow-orange-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gray-950">
                <img 
                  src="logo.png" 
                  alt="GasAlert Logo" 
                  className="w-16 h-16 object-contain"
                />
              </div>
            </div>
            <h2 className="text-white text-xl font-bold">GasAlert</h2>
          </div>
        </header>

        <div className="flex-1 flex justify-center items-center px-4 sm:px-6">
          <div className="w-full max-w-md space-y-8 relative">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-300">
                Bienvenido a GasAlert
              </h2>
              <p className="mt-3 text-gray-400">
                Monitorea tus tanques de combustible y recibe alertas en tiempo real
              </p>
            </div>

            {inactivityMessage && (
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
                {inactivityMessage}
              </div>
            )}

            {error && (
              <div className="absolute -top-4 left-0 right-0">
                <LoginErrorNotification message={error} onClose={clearError} />
              </div>
            )}

            {loading && !error ? (
              <div className="flex justify-center py-8">
                <div className="loader">
                  <li className="ball"></li>
                  <li className="ball"></li>
                  <li className="ball"></li>
                </div>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="mt-8 space-y-6 backdrop-blur-sm">
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-500 group-hover:text-orange-500 transition-colors" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className="block w-full pl-11 pr-4 py-4 text-white bg-gray-900/50 border border-gray-800 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all duration-200 hover:border-orange-500/30"
                      placeholder="Usuario"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-500 group-hover:text-orange-500 transition-colors" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      className="block w-full pl-11 pr-12 py-4 text-white bg-gray-900/50 border border-gray-800 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all duration-200 hover:border-orange-500/30"
                      placeholder="Contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-orange-500 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-4 px-4 border border-transparent rounded-xl text-white bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 font-medium shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
                  >
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <ShieldCheck className="h-5 w-5 text-orange-300 group-hover:text-orange-200" />
                    </span>
                    Iniciar sesión
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;