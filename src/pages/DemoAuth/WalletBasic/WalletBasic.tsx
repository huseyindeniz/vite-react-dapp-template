import React from 'react';

import { Stack, Title, Text, Alert } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IoIosWarning } from 'react-icons/io';

import { PageMeta } from '@/features/components/PageMeta/PageMeta';
import { withWalletProtection } from '@/features/wallet/hocs/withWalletProtection';

export const WalletBasicPage: React.FC = () => {
  const { t } = useTranslation('page-demoauth-walletbasic');

  return (
    <>
      <PageMeta
        title={t('Wallet Authentication - Basic')}
        url="/auth-demo/wallet-basic"
        description={t('Basic wallet authentication demo')}
      />
      <Stack gap="md">
        <Title order={2}>{t('Basic Wallet Authentication')}</Title>
        <Text>
          {t(
            'This page demonstrates basic Web3 wallet authentication using MetaMask, Coinbase Wallet, Core, or Rabby.'
          )}
        </Text>
        {withWalletProtection(
          <Alert title={t('Wallet Connected!')} color="green">
            {t(
              'You have successfully connected your wallet. This content is only visible to authenticated wallet users.'
            )}
          </Alert>,
          <Alert title={t('Wallet Required')} icon={<IoIosWarning />}>
            {t(
              'Please connect your wallet to view the protected content on this page.'
            )}
          </Alert>
        )}
        <Text c="dimmed" size="sm">
          {t(
            'This demonstrates the withWalletProtection HOC pattern for conditional rendering.'
          )}
        </Text>
      </Stack>
    </>
  );
};
