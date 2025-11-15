import { Avatar, Badge, Card, Group, Image, Text } from '@mantine/core';
import { NavLink } from 'react-router-dom';

import { usePageLink } from '@/core/features/router/hooks/usePageLink';
import { Post } from '@/domain/features/blog-demo/models/post/types/Post';

import classes from './PostItem.module.css';

export interface PostItemProps {
  post: Post;
}

export const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const { pageLink } = usePageLink();

  return (
    <Card
      withBorder
      padding="lg"
      radius="md"
      className={classes.card}
      component={NavLink}
      to={pageLink(`/blog/${post.id}`)}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <Card.Section mb="sm">
        <Image src={post.image} alt={post.title} height={180} />
      </Card.Section>

      <div className={classes.content}>
        <Badge variant="light">{post.category}</Badge>
        <Text className={classes.title} fw={500} lineClamp={2}>
          {post.title}
        </Text>
        <Text size="sm" c="dimmed" mt="xs" lineClamp={3}>
          {post.body}
        </Text>
      </div>

      <Group mt="lg" className={classes.author}>
        <Avatar src={post.author.avatar} radius="sm" />
        <div>
          <Text fw={500}>{post.author.name}</Text>
          <Text fz="xs" c="dimmed">
            posted {post.postedAt}
          </Text>
        </div>
      </Group>
    </Card>
  );
};
