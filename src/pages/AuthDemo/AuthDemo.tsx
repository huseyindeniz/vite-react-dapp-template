import React from 'react';

import { Title, Text, Stack, Card, List } from '@mantine/core';
import { useTranslation } from 'react-i18next';

export const AuthDemo: React.FC = () => {
  const { t } = useTranslation('PageAuthDemo');

  return (
    <Stack gap="md">
      <Title order={1}>{t('Authentication Demo')}</Title>
      <Text size="lg" c="dimmed">
        {t('This section demonstrates different authentication scenarios in the dApp template.')}
      </Text>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="sm">
          <Title order={3}>{t('Overview')}</Title>
          <Text>
            {t('Use the side navigation to explore different authentication patterns:')}
          </Text>
          <List>
            <List.Item>
              <strong>{t('Wallet - Basic:')}</strong> {t('Demonstrates Web3 wallet authentication using conditional rendering')}
            </List.Item>
            <List.Item>
              <strong>{t('Wallet - Protected:')}</strong> {t('Route-level protection requiring wallet connection')}
            </List.Item>
            <List.Item>
              <strong>{t('OAuth - Basic:')}</strong> {t('Demonstrates OAuth authentication (Google, GitHub) using conditional rendering')}
            </List.Item>
            <List.Item>
              <strong>{t('OAuth - Protected:')}</strong> {t('Route-level protection requiring OAuth login')}
            </List.Item>
            <List.Item>
              <strong>{t('Combined Auth:')}</strong> {t('Requires both OAuth and Web3 wallet authentication')}
            </List.Item>
          </List>
        </Stack>
      </Card>

      <Text size="sm" c="dimmed">
        {t('This parent page serves as an introduction while the side navigation provides quick access to specific examples.')}
      </Text>
    </Stack>
  );
};
