import React from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => {
    console.log(!!sessionStorage.getItem('token'))
  return !!sessionStorage.getItem('token');
};

const PrivateRoute = ({ component: Component }) => {
  return isAuthenticated() ? <Component /> : <Navigate to="/loginpage" />;
};

export default PrivateRoute;
