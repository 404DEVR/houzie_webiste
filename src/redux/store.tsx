import { configureStore } from '@reduxjs/toolkit';

// import refreshTokenMiddleware from './middleware/refreshTokenMiddleware';
import authReducer from './slices/authSlice';
import { addFormReducer, editFormReducer } from './slices/formslices';

const store = configureStore({
  reducer: {
    auth: authReducer, // Add the auth reducer here
    addForm: addFormReducer,
    editForm: editFormReducer,
  },
  // middleware: getDefaultMiddleware => getDefaultMiddleware().concat(refreshTokenMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
