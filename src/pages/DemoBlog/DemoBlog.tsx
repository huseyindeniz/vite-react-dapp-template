import React from 'react';

import { Stack, Title, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { Posts } from '@/features/blog-demo/components/Posts/Posts';
import { PageMeta } from '@/features/components/PageMeta/PageMeta';

export const DemoBlogPage: React.FC = () => {
  const { t } = useTranslation('page-demoblog');
  return (
    <>
      <PageMeta
        title={t('Blog Demo')}
        url="/demo-blog"
        description={t('Blog demo page')}
      />
      <Stack gap="md">
        <Title order={1}>{t('Posts')}</Title>
        <Text size="lg" c="dimmed">
          {t(
            'This section demonstrates slice-manager feature cache capabilities.'
          )}
        </Text>
        <Posts />
      </Stack>
    </>
  );
};
