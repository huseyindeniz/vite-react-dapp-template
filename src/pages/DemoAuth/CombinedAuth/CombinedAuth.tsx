import React from 'react';

import { Stack, Title, Text, Alert, Code, List } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { PageMeta } from '@/domain/layout/components/PageMeta/PageMeta';

export const CombinedAuthPage: React.FC = () => {
  const { t } = useTranslation('page-demoauth-combinedauth');

  return (
    <>
      <PageMeta
        title={t('Combined Authentication')}
        url="/auth-demo/combined"
        description={t('Page requiring both OAuth and Wallet authentication')}
      />
      <Stack gap="md">
        <Title order={2}>{t('Combined Authentication')}</Title>
        <Alert title={t('Dual Protection')} color="violet">
          {t(
            'This page requires BOTH OAuth authentication AND Web3 wallet connection. You must satisfy both requirements to access this content.'
          )}
        </Alert>
        <Text>
          {t(
            'This demonstrates the most restrictive protection level, combining two different authentication mechanisms:'
          )}
        </Text>
        <List>
          <List.Item>{t('OAuth/Social login (Google or GitHub)')}</List.Item>
          <List.Item>
            {t('Web3 wallet connection (MetaMask, Coinbase, etc.)')}
          </List.Item>
        </List>
        <Code block>protectionType: ProtectionType.BOTH</Code>
        <Text c="dimmed" size="sm">
          {t(
            'If you can see this page, you have successfully authenticated via both OAuth and connected your Web3 wallet.'
          )}
        </Text>
      </Stack>
    </>
  );
};
