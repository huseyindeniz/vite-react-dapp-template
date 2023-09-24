import React from 'react';

import { Box, Container, Stack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { withWalletProtection } from '@/features/wallet/hocs/withWalletProtection';

import { Header } from './components/Header';

export const UserPage: React.FC = withWalletProtection(() => {
  const { t } = useTranslation('PageUser');
  return (
    <Box>
      <Container maxW="7xl" py={2} as={Stack} spacing={2}>
        <Header />
        <Box>
          {t(
            "As an example, you can put current user's latest transactions here..."
          )}
        </Box>
      </Container>
    </Box>
  );
});
