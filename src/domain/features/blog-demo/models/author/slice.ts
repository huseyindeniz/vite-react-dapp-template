import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { authorsCleanup } from '../shared/actions';
import { LoadingStatusType } from '../shared/types/LoadingStatus';

import { Author } from './types/Author';
import { AuthorsStoreState } from './types/AuthorsStoreState';

// Create entity adapter
export const authorsAdapter = createEntityAdapter<Author>();

const initialState = authorsAdapter.getInitialState({
  loadingStatus: LoadingStatusType.IDLE,
  error: null,
  lastFetchParams: undefined,
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
    setLastFetchParams: (state, { payload }: PayloadAction<Record<string, unknown>>) => {
      state.lastFetchParams = payload;
    },
    setAuthors: authorsAdapter.setMany,
    addAuthor: authorsAdapter.addOne,
    resetAuthors: authorsAdapter.removeAll,
  },
  extraReducers: builder => {
    builder.addCase(authorsCleanup.type, state => {
      authorsAdapter.removeAll(state);
      state.loadingStatus = LoadingStatusType.IDLE;
      state.error = null;
      state.lastFetchParams = undefined;
    });
  },
});

// Export Actions & Reducer
export const {
  setLoading,
  setError,
  resetError,
  setLastFetchParams,
  setAuthors,
  addAuthor,
  resetAuthors,
} = authorSlice.actions;

// Export selectors
export const authorsSelectors = authorsAdapter.getSelectors();

export const authorsReducer = authorSlice.reducer;
