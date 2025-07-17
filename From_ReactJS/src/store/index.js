import { configureStore } from '@reduxjs/toolkit';
import studentReducer from './studentSlice';

const store = configureStore({
  reducer: {
    student: studentReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
});

export default store;