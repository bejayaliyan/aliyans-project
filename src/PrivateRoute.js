import { useEffect, useState, React } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { isAuthenticated, isVerified, getAuthUserRole } from "./auth";

function PrivateRoute({ children }) {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const role = await getAuthUserRole();
      setUserRole(role); // Update user role
      console.log(userRole);
    };

    fetchUserRole();
  }, []);

  return true ? children : <Navigate replace to="/home" />;
}

export default PrivateRoute;
