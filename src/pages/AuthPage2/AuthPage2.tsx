import React from 'react';

import { Container } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { PageMeta } from '@/features/ui/mantine/components/PageMeta/PageMeta';

export const AuthPage2: React.FC = () => {
  const { t } = useTranslation('PageAuthPage2');
  return (
    <>
      <PageMeta title={t('Auth Page 2')} url="/authpage2" description="Auth Page 2 demo page" />
      <Container ta="center">{t('auth page 2 protected page content')}</Container>
    </>
  );
};