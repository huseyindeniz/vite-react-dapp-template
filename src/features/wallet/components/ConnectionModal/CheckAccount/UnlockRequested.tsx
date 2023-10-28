import { Box, Progress, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { AlertMessage } from '@/features/ui/components/AlertMessage/AlertMessage';

export const UnlockRequested = () => {
  const { t } = useTranslation('FeatureWallet');
  return (
    <AlertMessage status="info" title={t('Unlock Requested')}>
      <VStack>
        <Box>
          {t('Waiting for the unlock wallet request to be accepted.')}
          <br />
          {t('Please check your Web3 wallet.')}
        </Box>
        <Progress w="full" size="xs" isIndeterminate colorScheme="blue" />
      </VStack>
    </AlertMessage>
  );
};
