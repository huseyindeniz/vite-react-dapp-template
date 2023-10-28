import React from 'react';

import { VStack, Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { AlertMessage } from '@/features/ui/components/AlertMessage/AlertMessage';

import { UnlockButton } from './UnlockButton';

interface LockedProps {
  onUnlock: () => void;
}
export const Locked: React.FC<LockedProps> = ({ onUnlock }) => {
  const { t } = useTranslation('FeatureWallet');
  return (
    <AlertMessage status="warning" title={t('Wallet Is Locked')}>
      <VStack>
        <Box>{t('Please unlock your wallet if you want to continue.')}</Box>
        <UnlockButton onUnlock={onUnlock} />
      </VStack>
    </AlertMessage>
  );
};
