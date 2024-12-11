import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Layout = () => {
  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Fondo con gradiente y efecto de ruido */}
      <div className="fixed inset-0 bg-gradient-to-b from-gray-950 via-[#14161a] to-gray-950">
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:64px_64px] opacity-20" />
        
        {/* Gradiente radial para dar profundidad */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/5 to-transparent" />
        
        {/* Efecto de brillo en las esquinas */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full filter blur-3xl opacity-20" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full filter blur-3xl opacity-20" />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 overflow-auto p-8">
          {/* Contenedor con efecto de glassmorphism para el contenido */}
          <div className="relative rounded-2xl backdrop-blur-sm bg-gray-950/30 border border-gray-800/50 shadow-xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;