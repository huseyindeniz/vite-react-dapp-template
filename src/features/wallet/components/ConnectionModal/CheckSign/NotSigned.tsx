import React from 'react';

import { Alert, Box, Stack } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IoIosWarning } from 'react-icons/io';

import { SignButton } from './SignButton';
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
    <Alert icon={<IoIosWarning />} title={t('Sign Required')}>
      <Stack>
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
      </Stack>
    </Alert>
  );
};
