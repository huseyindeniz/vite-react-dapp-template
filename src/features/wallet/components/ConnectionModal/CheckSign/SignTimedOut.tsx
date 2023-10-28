import React from 'react';

import { Box, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { AlertMessage } from '@/features/ui/components/AlertMessage/AlertMessage';

import { SignButton } from './SignButtonProps';

export interface SignTimedOutProps {
  onSign: (message: string) => void;
  onDisconnect: () => void;
}
export const SignTimedOut: React.FC<SignTimedOutProps> = ({
  onSign,
  onDisconnect,
}) => {
  const { t } = useTranslation('FeatureWallet');
  return (
    <AlertMessage status="warning" title={t('Sign Timed Out')}>
      <VStack>
        <Box>
          {t("You didn't respond to the sign request in time.")}
          <br />
          {t('Please try again if you want to continue.')}
        </Box>
      </VStack>
      <SignButton onSign={onSign} onDisconnect={onDisconnect} />
    </AlertMessage>
  );
};
