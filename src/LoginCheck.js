import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { isAuthenticated, isVerified,getAuthUser } from './auth';


function LoginCheck({ children }) {
    return isAuthenticated() ?  <Navigate replace to="/home" /> : children;
  }

export default LoginCheck;