import React from 'react';

import { Box, Button } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export interface SignButtonProps {
  onSign: (message: string) => void;
  onDisconnect: () => void;
}
export const SignButton: React.FC<SignButtonProps> = ({
  onSign,
  onDisconnect,
}) => {
  const { t } = useTranslation('FeatureWallet');
  const signMessage = t('SIGN_MESSAGE');
  return (
    <Box>
      <Button
        variant="solid"
        colorScheme="yellow"
        onClick={() => onSign(signMessage)}
      >
        {t('Sign In')}
      </Button>
      <Button ml={1} variant="solid" onClick={() => onDisconnect()}>
        {t('Cancel')}
      </Button>
    </Box>
  );
};
