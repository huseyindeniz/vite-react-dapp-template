import React from 'react';

import { Container, Stack, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { Posts } from '@/domain/features/blog-demo/components/Posts/Posts';
import { PageMeta } from '@/domain/layout/components/PageMeta/PageMeta';

export const DemoBlogPage: React.FC = () => {
  const { t } = useTranslation('page-demoblog');
  return (
    <>
      <PageMeta
        title={t('Blog Demo')}
        url="/demo-blog"
        description={t('Blog demo page')}
      />
      <Container size="xl" px={0}>
        <Stack gap="xl">
          <Stack gap="xs">
            <Title
              order={1}
              style={{
                fontSize: '42px',
                fontWeight: 700,
              }}
            >
              {t('Posts')}
            </Title>
            <Text size="lg" c="dimmed">
              {t(
                'This section demonstrates slice-manager feature cache capabilities.'
              )}
            </Text>
          </Stack>
          <Posts />
        </Stack>
      </Container>
    </>
  );
};
