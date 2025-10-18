import { EntityState } from '@reduxjs/toolkit';

import { LoadingStatusType } from '../../shared/types/LoadingStatus';

import { Post } from './Post';

export type PostsStoreState = EntityState<Post, number> & {
  language: string | null;
  loadingStatus: LoadingStatusType;
  error: string | null;
  lastFetchParams?: Record<string, unknown>;
};
