import { createAction } from '@reduxjs/toolkit';

export const fetchAuthor = createAction<number>(
  'BLOG_DEMO/AUTHOR/FETCH_AUTHOR'
);
