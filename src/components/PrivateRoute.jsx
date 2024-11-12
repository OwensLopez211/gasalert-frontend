// frontend/gasalert-frontend/src/components/PrivateRoute.jsx

import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const PrivateRoute = ({ element: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      element={
        AuthService.isAuthenticated() ? (
          <Component />
        ) : (
          <Navigate to="/login" replace />
        )
      }
    />
  );
};

export default PrivateRoute;