import { useEffect } from 'react';

import { useTypedSelector } from '@/hooks/useTypedSelector';

import { postsSelectors } from '../models/post/slice';
import { LoadingStatusType } from '../models/shared/types/LoadingStatus';

import { useActions } from './useActions';

export const useBlogPost = (postId: number) => {
  const actions = useActions();
  const state = useTypedSelector(state => state.blogDemo.posts);
  const post = useTypedSelector(state =>
    postsSelectors.selectById(state.blogDemo.posts, postId)
  );
  const isLoading = state.loadingStatus === LoadingStatusType.REQUESTED;
  const error = state.error;

  // Fetch post on mount if not already in store
  useEffect(() => {
    actions.fetchPost({ id: postId });
  }, [postId]);

  return {
    post,
    isLoading,
    error,
  };
};
