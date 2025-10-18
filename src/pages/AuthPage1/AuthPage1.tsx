import React from 'react';

import { Container, Stack, Alert } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IoIosWarning } from 'react-icons/io';

import { withAuthProtection } from '@/features/auth/hocs/withAuthProtection';
import { PageMeta } from '@/features/ui/mantine/components/PageMeta/PageMeta';

export const AuthPage1: React.FC = () => {
  const { t } = useTranslation('PageAuthPage1');
  return (
    <>
      <PageMeta title={t('Auth Page 1')} url="/authpage1" description="Auth Page 1 demo page" />
      <Container ta="center">
        <Stack>
          {withAuthProtection(
            <div>{t('hi there, this is auth protected content')}</div>,
            <Alert title="Auth Protected content" icon={<IoIosWarning />}>
              {t('You need to log in to see this content.')}
            </Alert>
          )}
          <div style={{ height: '3000px' }}>
            {t('auth page 1 public content with protected content')}
          </div>
          <div>{t('end of page')}</div>
        </Stack>
      </Container>
    </>
  );
};