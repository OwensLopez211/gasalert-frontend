import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginErrorNotification from '../components/LoginErrorNotification';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Estado de carga
  const { login, error, isAuthenticated, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const inactivityMessage = location.state?.message;

  // Redirigir si está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Temporizador para borrar el mensaje de error después de 5 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000); // El mensaje desaparecerá después de 5 segundos
      return () => clearTimeout(timer); // Limpia el temporizador al desmontar
    }
  }, [error, clearError]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Activar estado de carga
    try {
      await login(username, password);
    } catch (err) {
      console.error('Error en login:', err);
    } finally {
      if (!error) setLoading(false); // Desactivar loading solo si no hay error
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-gray-950 overflow-x-hidden">
      <div className="flex h-full grow flex-col">
        <header className="flex items-center justify-center whitespace-nowrap border-b border-solid border-gray-800 px-6 py-6">
          <div className="flex flex-col items-center text-white gap-2">
            <div className="h-16 w-16">
              <img 
                src="logo.png" 
                alt="GasAlert Logo" 
                className="w-16 h-16 object-contain"
              />
            </div>
            <h2 className="text-white text-lg font-bold leading-tight tracking-tight text-center">GasAlert</h2>
          </div>
        </header>
        <div className="px-4 sm:px-6 md:px-8 lg:px-40 flex flex-1 justify-center py-5">
          <div className="flex flex-col w-full max-w-xl py-5 flex-1">
            <h2 className="text-white text-2xl font-bold leading-tight px-4 text-left pb-3 pt-5">
              Bienvenido a GasAlert
            </h2>
            <p className="text-white text-base font-normal leading-normal pb-3 pt-1 px-4">
              Inicia sesión para monitorear tus tanques de combustible y recibir alertas.
            </p>

            {/* Mostrar mensaje de inactividad si aplica */}
            {inactivityMessage && (
              <div className="mx-4 mb-4 p-4 bg-blue-500 text-white rounded-xl">
                {inactivityMessage}
              </div>
            )}

            {/* Mostrar notificación de error si hay un error */}
            {error && (
              <div className="mx-4 mb-4">
                <LoginErrorNotification message={error} onClose={clearError} />
              </div>
            )}

            {/* Mostrar loader si está cargando */}
            {loading && !error ? (
              <div className="flex justify-center py-6">
                <div className="loader">
                  <li className="ball"></li>
                  <li className="ball"></li>
                  <li className="ball"></li>
                </div>
              </div>
            ) : (
              <form onSubmit={handleLogin}>
                <div className="flex max-w-md flex-wrap items-end gap-4 px-4 py-3">
                  <label htmlFor="username" className="flex flex-col min-w-40 flex-1">
                    <p className="text-white text-base font-medium leading-normal pb-2">Usuario</p>
                    <input
                      id="username"
                      placeholder="Usuario"
                      className="form-input flex w-full min-w-0 flex-1 resize-none rounded-xl text-white focus:outline-none focus:ring-0 border border-gray-700 bg-gray-900 focus:border-gray-700 h-14 placeholder:text-gray-500 p-4 text-base font-normal leading-normal"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </label>
                </div>
                <div className="flex max-w-md flex-wrap items-end gap-4 px-4 py-3">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-white text-base font-medium leading-normal pb-2">Contraseña</p>
                    <input
                      type="password"
                      placeholder="Contraseña"
                      className="form-input flex w-full min-w-0 flex-1 resize-none rounded-xl text-white focus:outline-none focus:ring-0 border border-gray-700 bg-gray-900 focus:border-gray-700 h-14 placeholder:text-gray-500 p-4 text-base font-normal leading-normal"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </label>
                </div>
                <div className="flex px-4 py-3">
                  <button
                    type="submit"
                    className="flex min-w-20 max-w-md cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 flex-1 bg-orange-600 hover:bg-orange-700 text-white text-base font-bold leading-normal tracking-wide transition-colors"
                  >
                    <span className="truncate">Iniciar sesión</span>
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
