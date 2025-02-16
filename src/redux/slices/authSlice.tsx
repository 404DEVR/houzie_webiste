import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  tokenExpiry: number | null;
}

const initialState: AuthState = {
  token: null,
  refreshToken: null,
  tokenExpiry: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateToken: (
      state,
      action: PayloadAction<{
        token: string;
        refreshToken: string;
        tokenExpiry: number;
      }>
    ) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.tokenExpiry = action.payload.tokenExpiry;
    },
    updateRefreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload;
    },
    logout: state => {
      state.token = null;
      state.refreshToken = null;
      state.tokenExpiry = null;
    },
  },
});

export const { updateToken, updateRefreshToken, logout } = authSlice.actions;
export default authSlice.reducer;