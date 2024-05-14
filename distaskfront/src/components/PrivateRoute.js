import React from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => {
    console.log(!!localStorage.getItem('token'))
  return !!localStorage.getItem('token');
};

const PrivateRoute = ({ component: Component }) => {
  return isAuthenticated() ? <Component /> : <Navigate to="/loginpage" />;
};

export default PrivateRoute;
