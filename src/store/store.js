import { configureStore } from '@reduxjs/toolkit';
import interviewReducer from './slices/interviewSlice';

const STORAGE_KEY = 'interviewAppState';

const loadState = () => {
  if (typeof window === 'undefined') return undefined;
  
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Could not load state:', err);
    return undefined;
  }
};

const store = configureStore({
  reducer: {
    interview: interviewReducer,
  },
  preloadedState: loadState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat((store) => (next) => (action) => {
      const result = next(action);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store.getState()));
      }
      return result;
    }),
});

export default store; 