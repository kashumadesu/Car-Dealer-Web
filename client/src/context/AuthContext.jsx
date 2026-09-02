import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Default to null or saved user. Users can register/sign in or quick-login.
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('drivehub_active_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState('');

  // Registered users database stored locally
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('drivehub_registered_users');
      return saved ? JSON.parse(saved) : [
        {
          id: 'cust-1',
          username: 'juan',
          fullName: 'Juan Dela Cruz',
          phone: '+63 918 555 1234',
          password: 'password123',
          role: 'customer'
        },
        {
          id: 'emp-1',
          username: 'johnreyes',
          fullName: 'John Reyes (Sales Manager)',
          phone: '+63 917 123 4567',
          password: 'password123',
          role: 'staff'
        },
        {
          id: 'admin-1',
          username: 'admin',
          fullName: 'Dealership Owner (Admin)',
          phone: '+63 999 888 7777',
          password: 'adminpassword',
          role: 'admin'
        }
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('drivehub_active_user', JSON.stringify(user));
      if (user.role === 'admin' || user.role === 'staff') {
        // preserve admin status if user logged into admin
      } else {
        setIsAdminMode(false);
      }
    } else {
      localStorage.removeItem('drivehub_active_user');
      setIsAdminMode(false);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('drivehub_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const signUp = ({ username, fullName, password, phone }) => {
    const existing = registeredUsers.find(u => u.username.toLowerCase() === username.toLowerCase().trim());
    if (existing) {
      return { success: false, error: 'Username already taken. Please pick another username.' };
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      username: username.trim(),
      fullName: fullName.trim(),
      phone: phone?.trim() || '+63 900 000 0000',
      password: password,
      role: 'customer'
    };

    setRegisteredUsers(prev => [...prev, newUser]);
    setUser(newUser);
    setIsAuthModalOpen(false);
    return { success: true, user: newUser };
  };

  const signIn = ({ username, password }) => {
    const found = registeredUsers.find(
      u => u.username.toLowerCase() === username.toLowerCase().trim() && u.password === password
    );

    if (!found) {
      return { success: false, error: 'Invalid username or password. Please check your credentials.' };
    }

    setUser(found);
    setIsAuthModalOpen(false);
    if (found.role === 'admin') {
      setIsAdminMode(true);
    }
    return { success: true, user: found };
  };

  const signOut = () => {
    setUser(null);
    setIsAdminMode(false);
  };

  const promptSignIn = (reason = '') => {
    setAuthModalReason(reason);
    setIsAuthModalOpen(true);
  };

  const loginAs = (role) => {
    if (role === 'admin') {
      const adminUser = registeredUsers.find(u => u.role === 'admin') || {
        id: 'admin-1',
        username: 'admin',
        fullName: 'Dealership Owner (Admin)',
        phone: '+63 999 888 7777',
        password: 'adminpassword',
        role: 'admin'
      };
      setUser(adminUser);
      setIsAdminMode(true);
    } else if (role === 'staff') {
      const staffUser = registeredUsers.find(u => u.role === 'staff') || {
        id: 'emp-1',
        username: 'johnreyes',
        fullName: 'John Reyes (Sales Manager)',
        phone: '+63 917 123 4567',
        password: 'password123',
        role: 'staff'
      };
      setUser(staffUser);
      setIsAdminMode(true);
    } else {
      const custUser = registeredUsers.find(u => u.role === 'customer') || {
        id: 'cust-1',
        username: 'juan',
        fullName: 'Juan Dela Cruz',
        phone: '+63 918 555 1234',
        password: 'password123',
        role: 'customer'
      };
      setUser(custUser);
      setIsAdminMode(false);
    }
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      isAdminMode,
      setIsAdminMode,
      isAuthModalOpen,
      setIsAuthModalOpen,
      authModalReason,
      promptSignIn,
      signUp,
      signIn,
      signOut,
      loginAs
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
