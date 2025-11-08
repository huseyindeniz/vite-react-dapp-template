import React from 'react';

import {
  Alert,
  Avatar,
  Container,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { MdError } from 'react-icons/md';

import { useOAuth } from '@/features/oauth/hooks/useOAuth';

export const Header: React.FC = () => {
  const { t } = useTranslation('feature-oauth');
  const { user, currentProvider } = useOAuth();

  if (!user) {
    return (
      <Container>
        <Alert icon={<MdError size={16} />} title={t('Error')} color="red">
          {t('Failed to retrieve user data. Please try logging in again.')}
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Title size="xs">{t('User Dashboard')}</Title>
      <Divider />
      <Paper shadow="md" p="md" withBorder>
        <Group>
          {user.avatarUrl && <Avatar src={user.avatarUrl} size="lg" />}
          <Stack gap="xs">
            <Title order={3}>{user.name}</Title>
            <Text size="sm" c="dimmed">
              {user.email}
            </Text>
            <Text size="xs" c="dimmed">
              {t('Signed in with {{provider}}', {
                provider: currentProvider,
              })}
            </Text>
          </Stack>
        </Group>
      </Paper>
      <Divider />
    </Container>
  );
};
