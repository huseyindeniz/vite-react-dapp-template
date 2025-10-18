import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { postsCleanup } from '../shared/actions';
import { LoadingStatusType } from '../shared/types/LoadingStatus';

import { Post } from './types/Post';
import { PostsStoreState } from './types/PostsStoreState';

// Create entity adapter
export const postsAdapter = createEntityAdapter<Post>();

const initialState = postsAdapter.getInitialState({
  language: null,
  loadingStatus: LoadingStatusType.IDLE,
  error: null,
  lastFetchParams: undefined,
}) as PostsStoreState;

// Create Redux Slice
const postsSlice = createSlice({
  name: 'posts',
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
    setLanguage: (state, { payload }: PayloadAction<string>) => {
      state.language = payload;
    },
    setLastFetchParams: (state, { payload }: PayloadAction<Record<string, unknown>>) => {
      state.lastFetchParams = payload;
    },
    addPosts: postsAdapter.addMany,
    addPost: postsAdapter.addOne,
    resetPosts: postsAdapter.removeAll,
  },
  extraReducers: builder => {
    builder.addCase(postsCleanup.type, state => {
      postsAdapter.removeAll(state);
      state.language = null;
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
  setLanguage,
  setLastFetchParams,
  addPosts,
  addPost,
  resetPosts,
} = postsSlice.actions;

// Export selectors
export const postsSelectors = postsAdapter.getSelectors();

export const postsReducer = postsSlice.reducer;
