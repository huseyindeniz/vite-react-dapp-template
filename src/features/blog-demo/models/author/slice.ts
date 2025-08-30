import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { authorsCleanup } from '../shared/actions';
import { LoadingStatusType } from '../shared/types/LoadingStatus';

import { Author } from './types/Author';
import { AuthorsStoreState } from './types/AuthorsStoreState';

const initialState = Object.freeze({
  authors: {},
  loadingStatus: LoadingStatusType.IDLE,
  error: null,
}) as AuthorsStoreState;

// Create Redux Slice
const authorSlice = createSlice({
  name: 'authors',
  initialState,
  reducers: {
    setLoading: (state, { payload }: PayloadAction<LoadingStatusType>) => {
      state.loadingStatus = payload;
    },
    setError: (state, { payload }: PayloadAction<string>) => {
      state.error = payload;
    },
    resetError: state => {
      state.error = null;
    },
    setAuthors: (state, action: PayloadAction<Author[]>) => {
      action.payload.forEach(author => {
        state.authors[author.id] = author;
      });
    },
    addAuthor: (state, action: PayloadAction<Author>) => {
      state.authors[action.payload.id] = action.payload;
    },
    resetAuthors: state => {
      state.authors = {};
    },
  },
  extraReducers: builder => {
    builder.addCase(authorsCleanup.type, state => {
      state.authors = {};
      state.loadingStatus = LoadingStatusType.IDLE;
      state.error = '';
    });
  },
});

// Export Actions & Reducer
export const {
  setLoading,
  setError,
  resetError,
  setAuthors,
  addAuthor,
  resetAuthors,
} = authorSlice.actions;
export const authorsReducer = authorSlice.reducer;
