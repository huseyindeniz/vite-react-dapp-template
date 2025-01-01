import React from 'react';

import { Container } from '@mantine/core';
import { useTranslation } from 'react-i18next';

export const Page2: React.FC = () => {
  const { t } = useTranslation('PagePage2');
  return (
    <Container ta="center">{t('page 2 protected page content')}</Container>
  );
};
