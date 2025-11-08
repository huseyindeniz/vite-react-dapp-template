import React from 'react';

import { Container, Divider, Stack, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { Posts } from '@/features/blog-demo/components/Posts/Posts';
import { PageMeta } from '@/features/components/PageMeta/PageMeta';

export const DemoBlogPage: React.FC = () => {
  const { t } = useTranslation('page-demoblog');
  return (
    <>
      <PageMeta title={t('Blog Demo')} url="/demo-blog" description={t('Blog demo page')} />
      <Container ta="center">
        <Stack>
          <Title mb={2}>Posts</Title>
          <Divider />
        </Stack>
        <Stack>
          <Posts />
        </Stack>
      </Container>
    </>
  );
};
