import React from 'react';

import { Alert, Container, Progress, Stack } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IoIosWarning } from 'react-icons/io';

export const SignInitialized: React.FC = () => {
  const { t } = useTranslation('FeatureWallet');
  return (
    <Container>
      <Alert icon={<IoIosWarning />} title={t('Preparing Sign Request')}>
        <Stack>
          <Progress color="blue" size="lg" animated value={100} />
        </Stack>
      </Alert>
    </Container>
  );
};
