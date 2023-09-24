import {
  Box,
  Center,
  Container,
  Stack,
  Heading,
  Divider,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { AlertMessage } from '@/features/ui/components/AlertMessage/AlertMessage';

export const WalletProtectionWarning: React.FC = () => {
  const { t } = useTranslation('FeatureWallet');
  return (
    <Box>
      <Container maxW="7xl" py={2} as={Stack} spacing={12}>
        <Stack spacing={0} align="center">
          <Heading mb={2}>{t('401 Unauthorized')}</Heading>
          <Divider />
        </Stack>
        <Center>
          <AlertMessage status="error" title="Access Denied">
            {t('You need to connect your wallet to see this page.')}
          </AlertMessage>
        </Center>
      </Container>
    </Box>
  );
};
