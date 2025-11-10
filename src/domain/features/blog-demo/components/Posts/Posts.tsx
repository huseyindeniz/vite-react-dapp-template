import { SimpleGrid } from '@mantine/core';

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
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            {data.map(post => (
              <PostItem key={post.id} post={post} />
            ))}
          </SimpleGrid>
          {/* ✅ Load More Button */}
          <PostLoadMoreButton loading={moreLoading} onClick={fetchMore} />
        </>
      )}
    </>
  );
};
