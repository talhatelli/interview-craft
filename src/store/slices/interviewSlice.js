import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveInterview, getAllInterviews, getInterview, updateInterview } from '../../services/interviewService';
import { STORAGE_KEYS } from '../../constants/storage';

const defaultInitialState = {
  stage: 1,
  jobDetails: {
    title: '',
    description: '',
    duration: '10',
    workLocation: 'onsite',
  },
  questions: [
    { id: '1', text: 'What are your strengths and weaknesses?', weightage: 1 },
    { id: '2', text: 'Describe a challenging project you worked on.', weightage: 2 },
    { id: '3', text: 'Why do you want to join our company?', weightage: 3 },
  ],
  isLoading: false,
  publishSuccess: false,
  selectedInterview: {}
};

export const fetchAllInterviews = createAsyncThunk(
  'interview/fetchAllInterviews',
  async () => {
    return await getAllInterviews();
  }
);

export const fetchInterviewDetails = createAsyncThunk(
  'interview/fetchInterviewDetails',
  async (interviewId) => {
    return await getInterview(interviewId);
  }
);

export const updateInterviewThunk = createAsyncThunk(
  'interview/updateInterview',
  async ({ id, jobDetails, questions }, { rejectWithValue }) => {
    try {
      await updateInterview(id, { jobDetails, questions });
      return { id, jobDetails, questions };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

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

const getInitialState = () => {
  try {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem(STORAGE_KEYS.INTERVIEW_APP_STATE);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        return parsedState.interview || defaultInitialState;
      }
    }
    return defaultInitialState;
  } catch (error) {
    console.error('Error loading initial state:', error);
    return defaultInitialState;
  }
};

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
    resetForm: (state) => {
      state.jobDetails = defaultInitialState.jobDetails;
      state.questions = defaultInitialState.questions;
      state.stage = 1;
      state.publishSuccess = false;
      state.selectedInterview = {};
    },
    clearPublishSuccess: (state) => {
      state.publishSuccess = false;
      state.updateSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(publishInterview.pending, (state) => {
        state.isLoading = true;
        state.publishSuccess = false;
      })
      .addCase(publishInterview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.publishSuccess = true;
        state.publishedId = action.payload;
      })
      .addCase(publishInterview.rejected, (state) => {
        state.isLoading = false;
        state.publishSuccess = false;
      })
      .addCase(fetchAllInterviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllInterviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allInterviews = action.payload;
      })
      .addCase(fetchAllInterviews.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchInterviewDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchInterviewDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedInterview = action.payload;
        state.questions = action.payload.questions;
        state.jobDetails = action.payload.jobDetails;
      })
      .addCase(fetchInterviewDetails.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateInterviewThunk.pending, (state) => {
        state.isLoading = true;
        state.updateSuccess = false;
      })
      .addCase(updateInterviewThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.updateSuccess = true;
        state.selectedInterview = action.payload;
        state.questions = action.payload.questions;
        state.jobDetails = action.payload.jobDetails;
      })
      .addCase(updateInterviewThunk.rejected, (state) => {
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
  resetForm,
  clearPublishSuccess
} = interviewSlice.actions;

export default interviewSlice.reducer;
