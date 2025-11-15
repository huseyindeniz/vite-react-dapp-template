import React from 'react';

import {
  Avatar,
  Badge,
  Container,
  Group,
  Image,
  Loader,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useBlogPost } from '@/domain/features/blog-demo/hooks/useBlogPost';
import { PageMeta } from '@/domain/layout/components/PageMeta/PageMeta';

export const DemoBlogPostPage: React.FC = () => {
  const { t } = useTranslation('page-demoblog');
  const { postId } = useParams();
  const postIdNumber = parseInt(postId || '0', 10);
  const { post, isLoading, error } = useBlogPost(postIdNumber);

  if (isLoading) {
    return (
      <Container ta="center" py="xl">
        <Loader size="lg" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container ta="center" py="xl">
        <Text c="red">{error}</Text>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container ta="center" py="xl">
        <Text>{t('Post not found')}</Text>
      </Container>
    );
  }

  return (
    <>
      <PageMeta
        title={post.title}
        url={`/blog/${post.id}`}
        description={post.body}
      />
      <Container size="md">
        <Stack gap="xl">
          <Image src={post.image} alt={post.title} radius="md" />

          <Stack gap="md">
            <Badge variant="light" size="lg" w="fit-content">
              {post.category}
            </Badge>

            <Title order={1}>{post.title}</Title>

            <Group>
              <Avatar src={post.author.avatar} radius="sm" size="md" />
              <div>
                <Text fw={500}>{post.author.name}</Text>
                <Text fz="sm" c="dimmed">
                  posted {post.postedAt}
                </Text>
              </div>
            </Group>

            <Text size="lg" style={{ lineHeight: 1.8 }}>
              {post.body}
            </Text>
          </Stack>
        </Stack>
      </Container>
    </>
  );
};
