import React from 'react';

import { Box, Button } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface UnlockButtonProps {
  onUnlock: () => void;
}

export const UnlockButton: React.FC<UnlockButtonProps> = ({ onUnlock }) => {
  const { t } = useTranslation('FeatureWallet');
  return (
    <Box>
      <Button variant="solid" colorScheme="yellow" onClick={() => onUnlock()}>
        {t('Unlock Wallet')}
      </Button>
    </Box>
  );
};
