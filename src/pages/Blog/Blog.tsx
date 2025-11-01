import React from 'react';

import { Container, Divider, Stack, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { Posts } from '@/features/blog-demo/components/Posts/Posts';
import { PageMeta } from '@/features/ui/mantine/components/PageMeta/PageMeta';

export const Blog: React.FC = () => {
  const { t } = useTranslation('PageBlog');
  return (
    <>
      <PageMeta title={t('Blog')} url="/blog" description={t('Blog page')} />
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
