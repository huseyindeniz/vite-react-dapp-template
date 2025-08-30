import { Button } from '@mantine/core';

export interface PostLoadMoreButtonProps {
  loading: boolean;
  onClick: () => void;
}

export const PostLoadMoreButton: React.FC<PostLoadMoreButtonProps> = ({
  loading,
  onClick,
}) => {
  return (
    <Button
      variant="outline"
      color="blue"
      fullWidth
      loading={loading}
      onClick={onClick}
      mt="md"
      disabled={loading}
    >
      {loading ? 'Loading...' : 'Load More'}
    </Button>
  );
};
