import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import useIdleTimeout from './hooks/useIdleTimeout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NotificationProvider } from './context/NotificationProvider';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <IdleTimeoutWrapper />
        <NotificationProvider>
          <AppRoutes />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark" // Tema oscuro para coincidir con tu interfaz
            toastStyle={{
              backgroundColor: '#1F2937', // Gris oscuro
              color: '#FFFFFF' // Texto blanco
            }}
          />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

const IdleTimeoutWrapper = () => {
  useIdleTimeout(1800000); // 30 minutos de inactividad en ms
  return null;
};

export default App;