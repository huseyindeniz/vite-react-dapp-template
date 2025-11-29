import { useEffect } from 'react';

import { i18n } from '@/core/features/i18n/i18n';
import { useTypedSelector } from '@/hooks/useTypedSelector';

import { postsSelectors } from '../models/post/slice';
import { LoadingStatusType } from '../models/shared/types/LoadingStatus';

import { useActions } from './useActions';

export const useBlogPosts = () => {
  const actions = useActions();
  const state = useTypedSelector(state => state.blogDemo.posts);
  const posts = useTypedSelector(state =>
    postsSelectors.selectAll(state.blogDemo.posts)
  );
  const isLoading = state.loadingStatus === LoadingStatusType.REQUESTED;

  // Trigger initial fetch on component mount - let smartFetch decide if it should fetch
  useEffect(() => {
    actions.fetchPosts({
      language: i18n.resolvedLanguage ?? i18n.language,
      limit: 5,
      start: 0,
    });
  }, [i18n.resolvedLanguage]);

  const fetchNextPosts = () => {
    if (isLoading) {
      return;
    }

    actions.fetchPosts({
      language: i18n.resolvedLanguage ?? i18n.language,
      limit: 5,
      start: posts.length,
    });
  };

  return {
    initialLoading: posts.length === 0 && isLoading,
    moreLoading: posts.length > 0 && isLoading,
    error: state.error,
    data: posts,
    fetchMore: fetchNextPosts,
  };
};
