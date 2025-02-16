'use client';

import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';
import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

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

const isTokenExpired = (token: string): boolean => {
  try {
    const decodedToken: any = jwtDecode(token);
    return decodedToken.exp * 1000 < Date.now();
  } catch (error) {
    console.error('Error decoding token:', error);
    return true; // Assume token is expired if it can't be decoded
  }
};

const checkTokenExpiration = (auth: User | null, logout: () => void) => {
  if (auth?.accessToken && isTokenExpired(auth.accessToken)) {
    logout();
  }
};

export const AuthProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [auth, setAuth] = useState<User | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const logout = useCallback(() => {
    setAuth(null);
    deleteCookie('auth');
  }, []);

  useEffect(() => {
    const authCookie = getCookie('auth');
    if (authCookie) {
      try {
        const userData = JSON.parse(authCookie as string);
        if (isTokenExpired(userData.accessToken)) {
          logout();
        } else {
          setAuth(userData);
        }
      } catch (error) {
        console.error('Error parsing auth cookie:', error);
        logout();
      }
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(
      () => checkTokenExpiration(auth, logout),
      60000
    );

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [logout]);

  const login = useCallback((userData: User) => {
    setAuth(userData);
    setCookie('auth', JSON.stringify(userData), {
      maxAge: 7 * 24 * 60 * 60, // 7 days
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
