import React from 'react';

const LoginErrorNotification = ({ message, onClose }) => {
  return (
    <div className="p-4 bg-red-500 text-white rounded-xl flex justify-between items-center">
      <span>{message}</span>
      <button 
        onClick={onClose} 
        className="ml-4 font-bold text-xl"
      >
        ×
      </button>
    </div>
  );
};

export default LoginErrorNotification;
