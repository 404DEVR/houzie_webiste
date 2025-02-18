import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import {
  useCallback,
  useContext,
  useDebugValue,
  useEffect,
  useState,
} from 'react';

import AuthContext from '@/lib/context/AuthProvider';

export interface User {
  userid: string;
  email: string;
  role: string;
  accessToken: string;
  refreshToken?: string;
}

export interface AuthContextType {
  auth: User | null;
  setAuth: React.Dispatch<React.SetStateAction<User | null>>;
}

const useAuth = () => {
  const context = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true); // Loading state for initialization

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { auth, setAuth } = context as AuthContextType;

  // Set debug value for React DevTools
  useDebugValue(auth, (auth) =>
    auth?.accessToken ? 'Logged In' : 'Logged Out'
  );

  const login = useCallback(
    (userData: User) => {
      setAuth(userData);
      setCookie('auth', JSON.stringify(userData), {
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
    },
    [setAuth]
  );

  const logout = useCallback(() => {
    setAuth(null);
    deleteCookie('auth', { path: '/' });
  }, [setAuth]);

  // Helper to check if token is expired
  const isTokenExpired = (token: string): boolean => {
    try {
      const decodedToken: any = JSON.parse(atob(token.split('.')[1]));
      return decodedToken.exp < Math.floor(Date.now() / 1000);
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  };

  const refreshAuth = useCallback(() => {
    const authCookie = getCookie('auth');
    if (authCookie) {
      try {
        const userData = JSON.parse(authCookie as string);

        // Check if the token is expired, and if so, log the user out
        if (isTokenExpired(userData.accessToken)) {
          logout();
        } else {
          setAuth(userData);
        }
      } catch (error) {
        logout();
      }
    } else {
      logout();
    }
  }, [setAuth, logout]);

  // Run refreshAuth once on mount to check cookie and set auth state
  useEffect(() => {
    refreshAuth();
    setIsLoading(false); // Done checking the cookie
  }, [refreshAuth]);

  return {
    auth,
    setAuth,
    login,
    logout,
    refreshAuth,
    isLoading, // Return loading state to control rendering
  };
};

export default useAuth;
