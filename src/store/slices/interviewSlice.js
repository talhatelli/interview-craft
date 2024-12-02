import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stage: 1,
  jobDetails: {
    title: '',
    description: '',
    duration: '10',
    workLocation: 'onsite',
  },
  questions: [],
  isLoading: false,
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    setStage: (state, action) => {
      state.stage = action.payload;
    },
    setJobDetails: (state, action) => {
      state.jobDetails = action.payload;
    },
    addQuestion: (state, action) => {
      state.questions.push(action.payload);
    },
    removeQuestion: (state, action) => {
      state.questions.splice(action.payload, 1);
    },
    updateQuestion: (state, action) => {
      const index = state.questions.findIndex(q => q.id === action.payload.id);
      if (index !== -1) {
        state.questions[index] = action.payload;
      }
    },
    reorderQuestions: (state, action) => {
      const { oldIndex, newIndex } = action.payload;
      const question = state.questions[oldIndex];
      state.questions.splice(oldIndex, 1);
      state.questions.splice(newIndex, 0, question);
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setStage,
  setJobDetails,
  addQuestion,
  removeQuestion,
  updateQuestion,
  reorderQuestions,
  setLoading,
} = interviewSlice.actions;

export default interviewSlice.reducer; 