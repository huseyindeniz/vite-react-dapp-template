import React from 'react';

import { VStack, Progress, Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { AlertMessage } from '@/features/ui/components/AlertMessage/AlertMessage';

export const NetworkSwitchRequested: React.FC = () => {
  const { t } = useTranslation('FeatureWallet');
  return (
    <AlertMessage status="info" title={t('Network Switch Requested')}>
      <VStack>
        <Box>
          {t('Waiting for the network switch request to be accepted.')}
          <br />
          {t('Please check your Web3 wallet.')}
        </Box>
        <Progress w="full" size="xs" isIndeterminate colorScheme="blue" />
      </VStack>
    </AlertMessage>
  );
};
