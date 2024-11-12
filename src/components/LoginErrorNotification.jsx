import React from 'react';

const LoginErrorNotification = ({ errorMessage, onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#271e1c] border border-[#54413b] rounded-xl w-full max-w-md p-6">
        <h2 className="text-white text-lg font-bold leading-tight mb-2">Error de Inicio de Sesión</h2>
        <p className="text-[#b9a49d] mt-2">{errorMessage}</p>
        <button
          onClick={onClose}
          className="text-[#ee5c2b] hover:bg-[#271e1c] focus:outline-none focus:ring-0 mt-4"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default LoginErrorNotification;