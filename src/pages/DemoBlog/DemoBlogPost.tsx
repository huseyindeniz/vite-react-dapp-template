import React from 'react';

import { Container } from '@mantine/core';
import { useParams } from 'react-router-dom';

export const DemoBlogPostPage: React.FC = () => {
  const { postId } = useParams();

  return <Container ta="center">Blog Post {postId} here</Container>;
};
