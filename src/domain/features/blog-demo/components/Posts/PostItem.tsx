import { Card, ThemeIcon, Text, Button } from '@mantine/core';
import { FaCheckCircle } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

import { usePageLink } from '@/core/features/router/hooks/usePageLink';

export interface PostItemProps {
  post: {
    id: number;
    title: string;
    body: string;
  };
}

export const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const { pageLink } = usePageLink();
  return (
    <Card key={post.id} shadow="sm" padding="lg" withBorder>
      <ThemeIcon color="teal" size={24} radius="xl">
        <FaCheckCircle size={16} />
      </ThemeIcon>
      <Button
        component={NavLink}
        to={pageLink(`/blog/${post.id}`)}
        variant="transparent"
      >
        {post.id}: {post.title}
      </Button>

      <Text c="dimmed" size="sm">
        {post.body}
      </Text>
    </Card>
  );
};
