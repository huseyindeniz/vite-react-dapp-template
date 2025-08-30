import { List } from '@mantine/core';

import { useBlogPosts } from '../../hooks/useBlogPosts';

import { PostEmptyList } from './PostEmptyList';
import { PostItem } from './PostItem';
import { PostLoading } from './PostLoading';
import { PostLoadingError } from './PostLoadingError';
import { PostLoadMoreButton } from './PostLoadMoreButton';

export const Posts: React.FC = () => {
  const { initialLoading, moreLoading, error, data, fetchMore } =
    useBlogPosts();

  return (
    <>
      {/* 🔵 Loading State */}
      {data.length === 0 && initialLoading && <PostLoading />}

      {/* 🔴 Error State */}
      {error && <PostLoadingError error={error} />}

      {/* ⚪ Empty State */}
      {!error && !initialLoading && data.length === 0 && <PostEmptyList />}

      {/* ✅ Data List */}
      {!error && !initialLoading && data.length > 0 && (
        <>
          <List spacing="md" size="md" center>
            {data.map(post => (
              <PostItem key={post.id} post={post} />
            ))}
          </List>
          {/* ✅ Load More Button */}
          <PostLoadMoreButton loading={moreLoading} onClick={fetchMore} />
        </>
      )}
    </>
  );
};
