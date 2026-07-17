import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles) {
    const roleList = Array.isArray(roles) ? roles : [roles];
    const userRole = user.role?.name || user.role;
    if (!roleList.includes(userRole)) {
      return <Navigate to="/erp/dashboard" replace />;
    }
  }

  // If children are passed, render them; otherwise render Outlet for nested routes
  return children ? children : <Outlet />;
}
