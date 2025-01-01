import React from 'react';

import { Alert, Text, Container, Stack } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IoIosWarning } from 'react-icons/io';

import { SignButton } from './SignButton';

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
    <Container>
      <Alert icon={<IoIosWarning />} title={t('Sign Rejected')} color="yellow">
        <Stack>
          <Text size="sm">
            {t('You rejected the sign request.')}
            <br />
            {t('Please try again if you want to continue.')}
          </Text>
          <SignButton onSign={onSign} onDisconnect={onDisconnect} />
        </Stack>
      </Alert>
    </Container>
  );
};
