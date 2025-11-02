import React from 'react';

import { Box, Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';

interface UnlockButtonProps {
  onUnlock: () => void;
}

export const UnlockButton: React.FC<UnlockButtonProps> = ({ onUnlock }) => {
  const { t } = useTranslation('FeatureWallet');
  return (
    <Box ta="right" mt="sm">
      <Button
        variant="filled"
        color="yellow"
        autoContrast
        onClick={() => onUnlock()}
      >
        {t('Unlock Wallet')}
      </Button>
    </Box>
  );
};
