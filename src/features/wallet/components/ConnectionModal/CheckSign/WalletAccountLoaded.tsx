import { Box, Progress, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { AlertMessage } from '@/features/ui/components/AlertMessage/AlertMessage';

export const WalletAccountLoaded = () => {
  const { t } = useTranslation('FeatureWallet');
  return (
    <AlertMessage status="success" title={t('Load Account')}>
      <VStack>
        <Box>
          {t('Your wallet account connected successfuly.')}
          <br />
          {t('Redirecting to app...')}
        </Box>
        <Progress w="full" size="xs" colorScheme="green" isIndeterminate />
      </VStack>
    </AlertMessage>
  );
};
