import React from 'react';

import { Container } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { PageMeta } from '@/features/ui/mantine/components/PageMeta/PageMeta';

export const AuthAndWalletPage: React.FC = () => {
  const { t } = useTranslation('PageAuthAndWallet');
  return (
    <>
      <PageMeta
        title={t('Auth and Wallet Protected Page')}
        url="/authandwallet"
        description="Auth and Wallet protected demo page"
      />
      <Container ta="center">
        {t('auth and wallet protected page content')}
      </Container>
    </>
  );
};
