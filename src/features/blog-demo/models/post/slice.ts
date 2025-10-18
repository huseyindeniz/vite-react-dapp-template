import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { postsCleanup } from '../shared/actions';
import { LoadingStatusType } from '../shared/types/LoadingStatus';

import { Post } from './types/Post';
import { PostsStoreState } from './types/PostsStoreState';

const initialState = Object.freeze({
  posts: [],
  language: null,
  loadingStatus: LoadingStatusType.IDLE,
  error: '',
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
    addPosts: (state, { payload }: PayloadAction<Post[]>) => {
      payload.forEach(post => {
        state.posts[post.id] = post;
      });
    },
    addPost: (state, action: PayloadAction<Post>) => {
      state.posts[action.payload.id] = action.payload;
    },
    resetPosts: state => {
      state.posts = [];
    },
  },
  extraReducers: builder => {
    builder.addCase(postsCleanup.type, state => {
      state.posts = [];
      state.language = null;
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
  setLanguage,
  addPosts,
  addPost,
  resetPosts,
} = postsSlice.actions;
export const postsReducer = postsSlice.reducer;
