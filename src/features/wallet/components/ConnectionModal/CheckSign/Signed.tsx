import { Box, Progress, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { AlertMessage } from '@/features/ui/components/AlertMessage/AlertMessage';

export const Signed = () => {
  const { t } = useTranslation('FeatureWallet');
  return (
    <AlertMessage status="success" title={t('Signed In')}>
      <VStack>
        <Box>
          {t('You have successfully signed the login request.')}
          <br />
          {t('Redirecting to app...')}
        </Box>
        <Progress w="full" size="xs" colorScheme="green" isIndeterminate />
      </VStack>
    </AlertMessage>
  );
};
