import { combineReducers } from '@reduxjs/toolkit';

import { authorsReducer } from './models/author/slice';
import { postsReducer } from './models/post/slice';

// Combine all reducers
export const blogDemoReducer = combineReducers({
  posts: postsReducer,
  authors: authorsReducer,
});
