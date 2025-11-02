import React from 'react';

import { Alert, Container, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IoIosWarning } from 'react-icons/io';

import { UnlockButton } from './UnlockButton';

interface LockedProps {
  onUnlock: () => void;
}
export const Locked: React.FC<LockedProps> = ({ onUnlock }) => {
  const { t } = useTranslation('FeatureWallet');
  return (
    <Container>
      <Alert
        icon={<IoIosWarning />}
        title={t('Wallet Is Locked')}
        color="yellow"
      >
        <Text size="sm">
          {t('Please unlock your wallet if you want to continue.')}
        </Text>
        <UnlockButton onUnlock={onUnlock} />
      </Alert>
    </Container>
  );
};
