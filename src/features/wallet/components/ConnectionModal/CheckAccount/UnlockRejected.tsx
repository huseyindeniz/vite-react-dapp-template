import React from 'react';

import { Stack, Alert, Container, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IoIosWarning } from 'react-icons/io';

import { UnlockButton } from './UnlockButton';

interface UnlockRejectedProps {
  onUnlock: () => void;
}
export const UnlockRejected: React.FC<UnlockRejectedProps> = ({ onUnlock }) => {
  const { t } = useTranslation('FeatureWallet');
  return (
    <Container>
      <Alert icon={<IoIosWarning />} title={t('Unlock Rejected')} color="red">
        <Stack>
          <Text size="sm">
            {t('You rejected the unlock wallet request.')}
            <br />
            {t('Please try again if you want to continue.')}
          </Text>
          <UnlockButton onUnlock={onUnlock} />
        </Stack>
      </Alert>
    </Container>
  );
};
