import { Progress, VStack, Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { AlertMessage } from '@/features/ui/components/AlertMessage/AlertMessage';

export const DetectingWallets = () => {
  const { t } = useTranslation('FeatureWallet');
  return (
    <AlertMessage status="info" title={t('Detecting wallets')}>
      <VStack>
        <Box>{t('Detecting installed Web3 wallets.')}</Box>
        <Progress w="full" size="xs" colorScheme="blue" isIndeterminate />
      </VStack>
    </AlertMessage>
  );
};
