import React from 'react';

import { Alert, Container, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IoIosWarning } from 'react-icons/io';

interface UnlockFailedProps {
  errorMessage: string | null;
}
export const UnlockFailed: React.FC<UnlockFailedProps> = ({ errorMessage }) => {
  const { t } = useTranslation('feature-wallet');
  return (
    <Container>
      <Alert icon={<IoIosWarning />} title={t('Unexpected Error')} color="red">
        <Text size="sm">
          {t('An error has occurred during the unlock wallet check.')}
          <br />
          {t('Please try again later.')}
          <br />
          {t('The error code was:')} {errorMessage}
        </Text>
      </Alert>
    </Container>
  );
};
