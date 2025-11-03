import React from 'react';

import { Box, Container } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { Header } from './Header';

export const OAuthProfilePage: React.FC = () => {
  const { t } = useTranslation('page-oauth-profile');

  return (
    <Container>
      <Header />
      <Box mt={10} ta="center">
        {t('Your OAuth profile content...')}
      </Box>
    </Container>
  );
};
