import React from 'react';

import { Container } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { PageMeta } from '@/features/ui/mantine/components/PageMeta/PageMeta';

export const Page2: React.FC = () => {
  const { t } = useTranslation('PagePage2');
  return (
    <>
      <PageMeta title={t('Page2')} url="/page2" description="Page2 page" />
      <Container ta="center">{t('page 2 protected page content')}</Container>
    </>
  );
};
