import { LoadingStatusType } from '../../shared/types/LoadingStatus';

import { Post } from './Post';

export type PostsStoreState = {
  posts: Record<number, Post>;
  loadingStatus: LoadingStatusType;
  error: string | null;
};
