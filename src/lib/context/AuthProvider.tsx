'use client';

import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import React, { createContext, useCallback, useEffect, useState } from 'react';

interface User {
  email: string;
  name: string;
  accessToken: string;
  refreshToken?: string;
}

interface AuthContextType {
  auth: User | null;
  setAuth: React.Dispatch<React.SetStateAction<User | null>>;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [auth, setAuth] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setAuth(null);
    deleteCookie('auth');
  }, []);

  useEffect(() => {
    const authCookie = getCookie('auth');

    if (authCookie) {
      try {
        const userData = JSON.parse(authCookie as string) as User;
        setAuth(userData);
      } catch (error) {
        setAuth(null);
      }
    } else {
      setAuth(null);
    }

    setLoading(false);
  }, [setAuth]);

  const login = useCallback((userData: User) => {
    setAuth(userData);
    setCookie('auth', JSON.stringify(userData), {
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }, []);

  const value: AuthContextType = {
    auth,
    setAuth,
    login,
    logout,
  };

  if (loading) {
    return <></>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
