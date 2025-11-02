import { Alert } from '@mantine/core';
import { useTranslation } from 'react-i18next';

export const PostEmptyList: React.FC = () => {
  const { t } = useTranslation('feature-blog-demo');
  return (
    <Alert title={t('No Posts Available')} color="gray">
      {t('There are no posts to display.')}
    </Alert>
  );
};
