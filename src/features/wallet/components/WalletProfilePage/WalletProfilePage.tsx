import React from 'react';

import { Box, Container } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { Header } from './Header';

export const WalletProfilePage: React.FC = () => {
  const { t } = useTranslation('feature-wallet');
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
