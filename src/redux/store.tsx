// store.ts
import { configureStore } from '@reduxjs/toolkit';

import { addFormReducer, editFormReducer } from './slices/formslices';

const store = configureStore({
  reducer: {
    addForm: addFormReducer,
    editForm: editFormReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
