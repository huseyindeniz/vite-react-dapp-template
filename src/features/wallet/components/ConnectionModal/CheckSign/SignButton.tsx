import React from 'react';

import { Button, Group } from '@mantine/core';
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
    <Group gap="xs">
      <Button
        variant="filled"
        color="yellow"
        autoContrast
        onClick={() => onSign(signMessage)}
      >
        {t('Sign In')}
      </Button>
      <Button variant="default" onClick={() => onDisconnect()}>
        {t('Cancel')}
      </Button>
    </Group>
  );
};
