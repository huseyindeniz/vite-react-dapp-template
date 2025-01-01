import React from 'react';

import { Alert, Stack, Progress, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IoIosWarning } from 'react-icons/io';

export const NetworkSwitchRequested: React.FC = () => {
  const { t } = useTranslation('FeatureWallet');
  return (
    <Alert icon={<IoIosWarning />} title={t('Network Switch Requested')}>
      <Stack>
        <Text size="sm">
          {t('Waiting for the network switch request to be accepted.')}
          <br />
          {t('Please check your Web3 wallet.')}
        </Text>
        <Progress w="full" size="xs" animated color="blue" value={100} />
      </Stack>
    </Alert>
  );
};
