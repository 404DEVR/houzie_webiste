import { Middleware } from '@reduxjs/toolkit';

import useRefreshToken from '@/hooks/useRefreshToken';

import { logout,updateToken } from '../slices/authSlice';
import { RootState } from '../store';

const refreshTokenMiddleware: Middleware<{}, RootState> = store => next => async action => {
  const state = store.getState();
  const { auth } = state;
  const refresh = useRefreshToken();

  if (auth.token && auth.tokenExpiry && Date.now() >= auth.tokenExpiry) {
    const newToken = await refresh();
    if (newToken) {
      // Update the token and token expiry in the state
      store.dispatch(
        updateToken({
          token: newToken,
          refreshToken: auth.refreshToken, // Include refresh token
          tokenExpiry: Date.now() + 3600 * 1000
        })
      );
    } else {
      // Handle token refresh failure (e.g., logout)
      store.dispatch(logout());
    }
  }

  return next(action);
};

export default refreshTokenMiddleware;