import React from 'react';

import { Container, Divider, Stack, Title } from '@mantine/core';

import { Posts } from '@/features/blog-demo/components/Posts/Posts';

export const Blog: React.FC = () => {
  return (
    <Container ta="center">
      <Stack>
        <Title mb={2}>Posts</Title>
        <Divider />
      </Stack>
      <Stack>
        <Posts />
      </Stack>
    </Container>
  );
};
