import { configureStore } from '@reduxjs/toolkit';
import interviewReducer from './slices/interviewSlice';

const store = configureStore({
  reducer: {
    interview: interviewReducer,
  },
});

export default store; 