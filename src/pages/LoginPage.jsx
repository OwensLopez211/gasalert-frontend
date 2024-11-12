import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isAuthenticated, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Si ya está autenticado, redirigir al dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      // No necesitamos navegar aquí porque el login en AuthContext ya maneja la navegación
    } catch (err) {
      console.error('Error en login:', err);
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#181311] dark group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#392c28] px-10 py-3">
          <div className="flex items-center gap-4 text-white">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* SVG path */}
              </svg>
            </div>
            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">GasAlert</h2>
          </div>
        </header>
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
            <h2 className="text-white tracking-light text-[28px] font-bold leading-tight px-4 text-left pb-3 pt-5">
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
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label htmlFor="username" className="flex flex-col min-w-40 flex-1">
                  <p className="text-white text-base font-medium leading-normal pb-2">Usuario</p>
                  <input
                    id="username"
                    placeholder="Usuario"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border border-[#54413b] bg-[#271e1c] focus:border-[#54413b] h-14 placeholder:text-[#b9a49d] p-[15px] text-base font-normal leading-normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </label>
              </div>
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-white text-base font-medium leading-normal pb-2">Contraseña</p>
                  <input
                    type="password"
                    placeholder="Contraseña"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border border-[#54413b] bg-[#271e1c] focus:border-[#54413b] h-14 placeholder:text-[#b9a49d] p-[15px] text-base font-normal leading-normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>
              </div>
              <div className="flex px-4 py-3">
                <button
                  type="submit"
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 flex-1 bg-[#ee5c2b] text-white text-base font-bold leading-normal tracking-[0.015em]"
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