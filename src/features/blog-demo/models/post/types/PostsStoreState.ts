import { LoadingStatusType } from '../../shared/types/LoadingStatus';

import { Post } from './Post';

export type PostsStoreState = {
  posts: Post[];
  language: string | null;
  loadingStatus: LoadingStatusType;
  error: string | null;
};
