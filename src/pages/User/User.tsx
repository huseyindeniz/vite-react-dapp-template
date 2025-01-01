import React from 'react';

import { Box, Container } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { Header } from './components/Header';

export const UserPage: React.FC = () => {
  const { t } = useTranslation('PageUser');
  return (
    <Container>
      <Header />
      <Box mt={10} ta="center">
        {t(
          "As an example, you can put current user's latest transactions here..."
        )}
      </Box>
    </Container>
  );
};
