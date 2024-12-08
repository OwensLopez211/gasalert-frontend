// routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Layout from '../layouts/Layout';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import TanksPage from '../pages/TanksPage';
import FuelAnalysisPage from '../pages/FuelAnalysisPage';
import ReportsPage from '../pages/ReportsPage';

/* 
import AlertsPage from '../pages/AlertsPage';
import MaintenancePage from '../pages/MaintenancePage';
import ReportsPage from '../pages/ReportsPage';
import SettingsPage from '../pages/SettingsPage'; */


const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* Rutas que requieren autenticación y muestran el sidebar */}
      {isAuthenticated && (
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="tanks" element={<TanksPage />} />
          <Route path="/analysis/:tankId?" element={<FuelAnalysisPage />} />
          <Route path="reports" element={<ReportsPage />} />
{/*    
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="maintenance" element={<MaintenancePage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} /> */}
          <Route path="*" element={<Navigate to="/dashboard" />} />

          
        </Route>
      )}

      {/* Redirecciona a /login si no está autenticado */}
      {!isAuthenticated && <Route path="*" element={<Navigate to="/login" />} />}
    </Routes>
  );
};

export default AppRoutes;
