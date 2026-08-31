import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('drivehub_user');
    return saved ? JSON.parse(saved) : {
      id: 'cust-1',
      name: 'Juan Dela Cruz',
      email: 'juan.delacruz@gmail.com',
      phone: '+63 918 555 1234',
      role: 'customer' // 'customer', 'staff', 'admin'
    };
  });

  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('drivehub_user', JSON.stringify(user));
  }, [user]);

  const loginAs = (role) => {
    if (role === 'admin') {
      setUser({
        id: 'admin-1',
        name: 'Dealership Owner',
        email: 'admin@drivehub.ph',
        phone: '+63 999 888 7777',
        role: 'admin'
      });
      setIsAdminMode(true);
    } else if (role === 'staff') {
      setUser({
        id: 'emp-1',
        name: 'John Reyes',
        email: 'john.reyes@drivehub.ph',
        phone: '+63 917 123 4567',
        role: 'staff'
      });
      setIsAdminMode(true);
    } else {
      setUser({
        id: 'cust-1',
        name: 'Juan Dela Cruz',
        email: 'juan.delacruz@gmail.com',
        phone: '+63 918 555 1234',
        role: 'customer'
      });
      setIsAdminMode(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isAdminMode, setIsAdminMode, loginAs }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
