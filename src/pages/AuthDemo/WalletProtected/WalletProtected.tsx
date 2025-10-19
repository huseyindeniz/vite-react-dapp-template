import React from 'react';

import { Stack, Title, Text, Alert, Code } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { PageMeta } from '@/features/ui/mantine/components/PageMeta/PageMeta';

export const WalletProtected: React.FC = () => {
  const { t } = useTranslation('PageWalletProtected');

  return (
    <>
      <PageMeta
        title={t('Wallet Protected Page')}
        url="/auth-demo/wallet-protected"
        description={t('Fully protected page requiring wallet authentication')}
      />
      <Stack gap="md">
        <Title order={2}>{t('Wallet Protected Page')}</Title>
        <Alert title={t('Protected Route')} color="blue">
          {t('This entire page is protected by wallet authentication at the route level. You can only access this page if you have connected your wallet.')}
        </Alert>
        <Text>
          {t('Unlike the Basic Wallet page which uses conditional rendering, this page uses route-level protection configured in the routes configuration.')}
        </Text>
        <Code block>
          protectionType: ProtectionType.WALLET
        </Code>
        <Text c="dimmed" size="sm">
          {t('If you can see this page, you have successfully connected your Web3 wallet.')}
        </Text>
      </Stack>
    </>
  );
};
