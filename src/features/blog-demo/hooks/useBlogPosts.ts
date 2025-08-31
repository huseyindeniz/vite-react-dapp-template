import { useEffect, useState } from 'react';

import log from 'loglevel';

import useTypedSelector from '@/hooks/useTypedSelector';

import { LoadingStatusType } from '../models/shared/types/LoadingStatus';

import { useActions } from './useActions';

export const useBlogPosts = () => {
  const actions = useActions();
  const state = useTypedSelector(state => state.blogDemo.posts);
  const error = state.error;
  const posts = Object.values(state.posts);
  const isLoading = state.loadingStatus === LoadingStatusType.REQUESTED;

  // Track if we need to fetch more posts
  const [moreLoading, setMoreLoading] = useState<boolean>(false);
  const [lastPostCount, setLastPostCount] = useState<number>(0);

  // Trigger initial fetch on component mount - let smartFetch decide if it should fetch
  useEffect(() => {
    actions.fetchPosts({ limit: 5, start: 0 });
  }, []);

  // Reset moreLoading state when new posts are loaded after load more
  useEffect(() => {
    if (!isLoading && moreLoading && posts.length > lastPostCount) {
      setMoreLoading(false);
      setLastPostCount(posts.length);
    }
  }, [isLoading, moreLoading, posts.length, lastPostCount]);

  // Function to fetch more posts when Load More is clicked
  const fetchNextPosts = () => {
    if (isLoading || moreLoading) {
      return; // Prevent fetching if already loading
    }

    const startIndex = posts.length;
    setLastPostCount(posts.length); // Remember current count
    setMoreLoading(true);

    log.debug(
      `Load More: posts.length=${posts.length}, calling fetchPosts with start=${startIndex}`
    );
    actions.fetchPosts({
      limit: 5,
      start: startIndex, // Continue from the last loaded index
    });
  };

  return {
    initialLoading: posts.length === 0 && isLoading,
    moreLoading,
    error,
    data: posts,
    fetchMore: fetchNextPosts,
  };
};
