// import { Middleware } from '@reduxjs/toolkit';
// import useRefreshToken from '@/hooks/useRefreshToken';
// import { logout, updateToken } from '../slices/authSlice';
// import { RootState } from '../store';

// const refreshTokenMiddleware: Middleware<{}, RootState> =
//   (store) => (next) => async (action) => {
//     const state = store.getState();
//     const { auth } = state;
//     const refresh = useRefreshToken();

//     if (auth.token && auth.tokenExpiry && Date.now() >= auth.tokenExpiry) {
//       const newToken = await refresh();
//       if (newToken) {
//         store.dispatch(
//           updateToken({
//             token: newToken,
//             refreshToken: auth.refreshToken ?? '',
//             tokenExpiry: Date.now() + 3600 * 1000,
//           })
//         );
//       } else {
//         store.dispatch(logout());
//       }
//     }

//     return next(action);
//   };

// export default refreshTokenMiddleware;

import React from 'react';

const refreshTokenMiddleware = () => {
  return null;
};

export default refreshTokenMiddleware;
