import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isAuthenticated, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
    } catch (err) {
      console.error('Error en login:', err);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-gray-950 overflow-x-hidden">
      <div className="flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-800 px-6 py-3">
          <div className="flex items-center gap-4 text-white">
            <div className="h-4 w-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* SVG path */}
              </svg>
            </div>
            <h2 className="text-white text-lg font-bold leading-tight tracking-tight">GasAlert</h2>
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
            {error && (
              <div className="mx-4 mb-4 p-4 bg-red-500 text-white rounded-xl">
                {error}
                <button 
                  onClick={clearError}
                  className="float-right font-bold"
                >
                  ×
                </button>
              </div>
            )}
            <form onSubmit={handleLogin}>
              <div className="flex max-w-md flex-wrap items-end gap-4 px-4 py-3">
                <label htmlFor="username" className="flex flex-col min-w-40 flex-1">
                  <p className="text-white text-base font-medium leading-normal pb-2">Usuario</p>
                  <input
                    id="username"
                    placeholder="Usuario"
                    className="form-input flex w-full min-w-0 flex-1 resize-none rounded-xl 
                             text-white focus:outline-none focus:ring-0 
                             border border-gray-700 bg-gray-900 
                             focus:border-gray-700 h-14 
                             placeholder:text-gray-500 p-4 
                             text-base font-normal leading-normal"
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
                    className="form-input flex w-full min-w-0 flex-1 resize-none rounded-xl 
                             text-white focus:outline-none focus:ring-0 
                             border border-gray-700 bg-gray-900 
                             focus:border-gray-700 h-14 
                             placeholder:text-gray-500 p-4 
                             text-base font-normal leading-normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>
              </div>
              <div className="flex px-4 py-3">
                <button
                  type="submit"
                  className="flex min-w-20 max-w-md cursor-pointer items-center 
                           justify-center overflow-hidden rounded-xl h-12 px-5 
                           flex-1 bg-orange-600 hover:bg-orange-700 
                           text-white text-base font-bold leading-normal 
                           tracking-wide transition-colors"
                >
                  <span className="truncate">Iniciar sesión</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;