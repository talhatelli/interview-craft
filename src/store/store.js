import { configureStore } from '@reduxjs/toolkit';
import interviewReducer from './slices/interviewSlice';

const localStorageMiddleware = store => next => action => {
  const result = next(action);
  localStorage.setItem('interviewState', JSON.stringify(store.getState()));
  return result;
};

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('interviewState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state:', err);
    return undefined;
  }
};

const store = configureStore({
  reducer: {
    interview: interviewReducer,
  },
  preloadedState: loadState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export default store; 