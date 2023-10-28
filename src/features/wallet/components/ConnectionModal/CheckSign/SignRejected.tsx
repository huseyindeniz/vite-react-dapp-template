import React from 'react';

import { Box, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { AlertMessage } from '@/features/ui/components/AlertMessage/AlertMessage';

import { SignButton } from './SignButtonProps';

export interface SignRejectedProps {
  onSign: (message: string) => void;
  onDisconnect: () => void;
}
export const SignRejected: React.FC<SignRejectedProps> = ({
  onSign,
  onDisconnect,
}) => {
  const { t } = useTranslation('FeatureWallet');
  return (
    <AlertMessage status="warning" title={t('Sign Rejected')}>
      <VStack>
        <Box>
          {t('You rejected the sign request.')}
          <br />
          {t('Please try again if you want to continue.')}
        </Box>
        <SignButton onSign={onSign} onDisconnect={onDisconnect} />
      </VStack>
    </AlertMessage>
  );
};
