import React from 'react';

import { Box, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { AlertMessage } from '@/features/ui/components/AlertMessage/AlertMessage';

import { SignButton } from './SignButtonProps';
import { WhySignNeeded } from './WhySignNeeded';

export interface NotSignedProps {
  onSign: (message: string) => void;
  onDisconnect: () => void;
}
export const NotSigned: React.FC<NotSignedProps> = ({
  onSign,
  onDisconnect,
}) => {
  const { t } = useTranslation('FeatureWallet');
  return (
    <AlertMessage status="warning" title={t('Sign Required')}>
      <VStack>
        <Box>
          {t(
            'In order to use this app, you need to sign the login request in your wallet.'
          )}
        </Box>
        <Box>
          <SignButton onSign={onSign} onDisconnect={onDisconnect} />
        </Box>
        <Box>
          <WhySignNeeded />
        </Box>
      </VStack>
    </AlertMessage>
  );
};
