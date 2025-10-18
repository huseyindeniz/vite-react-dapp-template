import { createAction } from '@reduxjs/toolkit';

export const fetchPosts = createAction<{
  language: string;
  limit: number;
  start: number;
}>('BLOG_DEMO/POST/FETCH_POSTS');
