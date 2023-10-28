import React from 'react';

import { Box, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { AlertMessage } from '@/features/ui/components/AlertMessage/AlertMessage';

import { UnlockButton } from './UnlockButton';

interface UnlockRejectedProps {
  onUnlock: () => void;
}
export const UnlockRejected: React.FC<UnlockRejectedProps> = ({ onUnlock }) => {
  const { t } = useTranslation('FeatureWallet');
  return (
    <AlertMessage status="warning" title={t('Unlock Rejected')}>
      <VStack>
        <Box>
          {t('You rejected the unlock wallet request.')}
          <br />
          {t('Please try again if you want to continue.')}
        </Box>
        <UnlockButton onUnlock={onUnlock} />
      </VStack>
    </AlertMessage>
  );
};
