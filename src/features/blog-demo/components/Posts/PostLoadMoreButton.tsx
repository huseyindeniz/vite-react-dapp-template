import { Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';

export interface PostLoadMoreButtonProps {
  loading: boolean;
  onClick: () => void;
}

export const PostLoadMoreButton: React.FC<PostLoadMoreButtonProps> = ({
  loading,
  onClick,
}) => {
  const { t } = useTranslation('FeatureBlogDemo');
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
      {loading ? t('Loading...') : t('Load More')}
    </Button>
  );
};
