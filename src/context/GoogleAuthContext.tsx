import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
}

interface GoogleAuthContextType {
  user: UserInfo | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const GoogleAuthContext = createContext<GoogleAuthContextType | undefined>(undefined);

export const GoogleAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>({
    id: 'mock-user-id',
    email: 'admin@erp.local',
    name: 'Admin User',
    picture: 'https://ui-avatars.com/api/?name=Admin+User&background=111f42&color=fff'
  });
  const [loading, setLoading] = useState(false);

  const login = async () => {
    // Mock login
    setUser({
      id: 'mock-user-id',
      email: 'admin@erp.local',
      name: 'Admin User',
      picture: 'https://ui-avatars.com/api/?name=Admin+User&background=111f42&color=fff'
    });
  };

  const logout = async () => {
    // Mock logout
    setUser(null);
  };

  return (
    <GoogleAuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </GoogleAuthContext.Provider>
  );
};

export const useGoogleAuth = () => {
  const context = useContext(GoogleAuthContext);
  if (context === undefined) {
    throw new Error('useGoogleAuth must be used within a GoogleAuthProvider');
  }
  return context;
};
