import { useDispatch } from 'react-redux';

import useAuth from '@/hooks/useAuth';

import { AUTH_API_URL } from '@/constant/authUrl';
import { RefreshResponse } from '@/interfaces/Interface';
import { updateToken } from '@/redux/slices/authSlice';

const useRefreshToken = () => {
  const dispatch = useDispatch();
  const { auth } = useAuth();

  const refresh = async (): Promise<string | null> => {
    try {
      const response = await fetch(`${AUTH_API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: auth?.refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data: RefreshResponse = await response.json();
      dispatch(
        updateToken({
          token: data.accessToken,
          refreshToken: data.refreshToken,
          tokenExpiry: Date.now() + data.expiresIn * 1000,
        })
      );

      return data.accessToken;
    } catch (error) {
      return null;
    }
  };

  return refresh;
};

export default useRefreshToken;
