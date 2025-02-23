import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import { addFormReducer, editFormReducer } from './slices/formslices';
import searchReducer from './slices/searchSlice';
import subscriptionReducer from './slices/subscriptionSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    addForm: addFormReducer,
    editForm: editFormReducer,
    search: searchReducer,
    subscription: subscriptionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
