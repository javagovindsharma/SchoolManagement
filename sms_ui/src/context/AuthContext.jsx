import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  const login = useCallback((userData, authToken) => {
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const hasPermission = useCallback((permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  }, [user]);

  const hasRole = useCallback((roles) => {
    if (!user) return false;
    const roleList = Array.isArray(roles) ? roles : [roles];
    return roleList.includes(user.role?.name || user.role);
  }, [user]);

  const getDashboardPath = useCallback(() => {
    if (!user) return '/login';
    const role = user.role?.name || user.role;
    switch (role) {
      case 'SUPER_ADMIN':
      case 'ORG_ADMIN':
      case 'BRANCH_ADMIN':
      case 'PRINCIPAL':
        return '/erp/dashboard';
      case 'TEACHER':
        return '/erp/teacher/dashboard';
      case 'STUDENT':
        return '/erp/student/dashboard';
      case 'PARENT':
        return '/erp/parent/dashboard';
      case 'ACCOUNTANT':
        return '/erp/fees';
      case 'LIBRARIAN':
        return '/erp/library';
      case 'HR_MANAGER':
        return '/erp/hr';
      case 'TRANSPORT_MANAGER':
        return '/erp/transport';
      default:
        return '/erp/dashboard';
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, hasPermission, hasRole, getDashboardPath }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
