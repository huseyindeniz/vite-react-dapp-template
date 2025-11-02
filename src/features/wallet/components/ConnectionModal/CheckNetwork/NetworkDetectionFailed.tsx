import React from 'react';

import { Alert, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IoIosWarning } from 'react-icons/io';

export interface NetworkDetectionFailedProps {
  errorMessage: string | null;
}
export const NetworkDetectionFailed: React.FC<NetworkDetectionFailedProps> = ({
  errorMessage,
}) => {
  const { t } = useTranslation('FeatureWallet');
  return (
    <Alert icon={<IoIosWarning />} title={t('Unexpected Error')} color="red">
      <Text size="sm">
        {t('An error has occured during the network check.')}
        <br />
        {t('Please try again later.')}
        <br />
        {t('The error code was:')} {errorMessage}
      </Text>
    </Alert>
  );
};
