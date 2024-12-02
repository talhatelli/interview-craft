import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveInterview } from '../../services/interviewService';

const getInitialState = () => {
  if (typeof window !== 'undefined') {
    const savedState = localStorage.getItem('interviewState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      return parsedState.interview;
    }
  }
  
  return {
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
};

// Async thunk for publishing interview
export const publishInterview = createAsyncThunk(
  'interview/publishInterview',
  async (_, { getState }) => {
    const state = getState().interview;
    const interviewData = {
      jobDetails: state.jobDetails,
      questions: state.questions,
      createdAt: new Date().toISOString()
    };
    
    try {
      const interviewId = await saveInterview(interviewData);
      return interviewId;
    } catch (error) {
      throw error;
    }
  }
);

const interviewSlice = createSlice({
  name: 'interview',
  initialState: getInitialState(),
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
    resetState: () => getInitialState(),
  },
  extraReducers: (builder) => {
    builder
      .addCase(publishInterview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(publishInterview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.publishedId = action.payload;
      })
      .addCase(publishInterview.rejected, (state) => {
        state.isLoading = false;
      });
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
  resetState,
} = interviewSlice.actions;

export default interviewSlice.reducer; 