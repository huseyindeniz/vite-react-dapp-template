import React from 'react';

import { Alert, Container, Stack, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IoIosWarning } from 'react-icons/io';

import { SignButton } from './SignButton';

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
    <Container>
      <Alert icon={<IoIosWarning />} title={t('Sign Timed Out')} color="yellow">
        <Stack>
          <Text size="sm">
            {t("You didn't respond to the sign request in time.")}
            <br />
            {t('Please try again if you want to continue.')}
          </Text>
          <SignButton onSign={onSign} onDisconnect={onDisconnect} />
        </Stack>
      </Alert>
    </Container>
  );
};
