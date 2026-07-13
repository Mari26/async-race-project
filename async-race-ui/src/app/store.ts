import { configureStore } from '@reduxjs/toolkit';
import garageReducer from '../features/garage/garageSlice';
import winnersReducer from '../features/garage/winnersSlice';

export const store = configureStore({
  reducer: {
    garage: garageReducer,
    winners: winnersReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;