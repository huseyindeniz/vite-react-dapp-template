import React from 'react';

import { Container, Stack, Alert } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IoIosWarning } from 'react-icons/io';

import { PageMeta } from '@/features/ui/mantine/components/PageMeta/PageMeta';
import { withWalletProtection } from '@/features/wallet/hocs/withWalletProtection';

export const Page1: React.FC = () => {
  const { t } = useTranslation('PagePage1');
  return (
    <>
      <PageMeta title={t('Page1')} url="/page1" description="Page1 page" />
      <Container ta="center">
        <Stack>
          {withWalletProtection(
            <div>{t('hi there, this is protected content')}</div>,
            <Alert title="Protected content" icon={<IoIosWarning />}>
              {t('You need to connect your wallet to see this content.')}
            </Alert>
          )}
          <div style={{ height: '3000px' }}>
            {t('page 1 public content with protected content')}
          </div>
          <div>{t('end of page')}</div>
        </Stack>
      </Container>
    </>
  );
};
