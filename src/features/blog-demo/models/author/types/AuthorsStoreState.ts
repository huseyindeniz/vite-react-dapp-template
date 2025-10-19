import { EntityState } from '@reduxjs/toolkit';

import { LoadingStatusType } from '../../shared/types/LoadingStatus';

import { Author } from './Author';

export type AuthorsStoreState = EntityState<Author, number> & {
  loadingStatus: LoadingStatusType;
  error: string | null;
  lastFetchParams?: Record<string, unknown>;
};
