import { LoadingStatusType } from '../../shared/types/LoadingStatus';

import { Author } from './Author';

export type AuthorsStoreState = {
  authors: Record<number, Author>;
  loadingStatus: LoadingStatusType;
  error: string | null;
};
