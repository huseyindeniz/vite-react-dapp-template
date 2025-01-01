import React from 'react';

import { Alert, RingProgress, Group, Text, Container } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IoIosWarning } from 'react-icons/io';

export interface SignRequestedProps {
  signCounter: number;
}
export const SignRequested: React.FC<SignRequestedProps> = ({
  signCounter,
}) => {
  const { t } = useTranslation('FeatureWallet');
  return (
    <Container>
      <Alert
        icon={<IoIosWarning />}
        title={t('Waiting Signature')}
        color="yellow"
      >
        <Group>
          <RingProgress
            sections={[{ value: (100 * signCounter) / 60, color: 'yellow' }]}
            color="blue"
            label={
              <Text ta="center" size="xs">
                {`${signCounter}s`}
              </Text>
            }
            size={60}
            thickness={4}
          />
          <Text size="sm">
            {t('Waiting for the login request to be signed.')}
            <br />
            {t('Please check your Web3 wallet.')}
          </Text>
        </Group>
      </Alert>
    </Container>
  );
};
