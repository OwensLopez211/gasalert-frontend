import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import useIdleTimeout from './hooks/useIdleTimeout';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <IdleTimeoutWrapper />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

const IdleTimeoutWrapper = () => {
  useIdleTimeout(1800000); // 30 minutos de inactividad en ms
  return null;
};

export default App;