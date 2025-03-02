import { configureStore } from '@reduxjs/toolkit';
import notesReducer from './notesSlice';
import userPreferencesReducer from './userPreferencesSlice';

export const store = configureStore({
  reducer: {
    notes: notesReducer,
    userPreferences: userPreferencesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
