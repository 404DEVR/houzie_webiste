// hooks/useAuth.ts
import { useContext, useDebugValue, useCallback } from 'react';
import AuthContext from '@/lib/context/AuthProvider';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

export interface User {
  email: string;
  name: string;
  accessToken: string;
  refreshToken?: string;
}

export interface AuthContextType {
  auth: User | null;
  setAuth: React.Dispatch<React.SetStateAction<User | null>>;
}


const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { auth, setAuth } = context as AuthContextType;

  useDebugValue(auth, (auth) => (auth?.accessToken ? 'Logged In' : 'Logged Out'));

  const login = useCallback((userData: User) => {
    setAuth(userData);
    setCookie('auth', JSON.stringify(userData), {
      maxAge: 7 * 24 * 60 * 60, 
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }, [setAuth]);

  const logout = useCallback(() => {
    
  }, [setAuth]);

  const refreshAuth = useCallback(() => {
    const authCookie = getCookie('auth');
    if (authCookie) {
      try {
        const userData = JSON.parse(authCookie as string);
        setAuth(userData);
      } catch (error) {
        console.error('Error parsing auth cookie:', error);
        logout();
      }
    }
  }, [setAuth, logout]);

  return { 
    auth, 
    setAuth, 
    login, 
    logout, 
    refreshAuth 
  };
};

export default useAuth;
