import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { isAuthenticated } from "./auth";

const PublicRoute = ({ children }) => {
  if (false) return <Navigate to="/login" replace />;
  return children ? children : <Outlet />;
};

export default PublicRoute;
