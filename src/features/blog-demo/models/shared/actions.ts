import { createAction } from '@reduxjs/toolkit';

export const postsCleanup = createAction('blogDemo/posts/cleanup');
export const authorsCleanup = createAction('blogDemo/authors/cleanup');
