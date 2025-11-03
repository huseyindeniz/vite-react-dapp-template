import { Alert, Text, Container, Progress, Stack } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IoIosWarning } from 'react-icons/io';

export const Signed = () => {
  const { t } = useTranslation('feature-wallet');
  return (
    <Container>
      <Alert icon={<IoIosWarning />} title={t('Signed In')} color="green">
        <Stack>
          <Text size="sm">
            {t('You have successfully signed the login request.')}
            <br />
            {t('Redirecting to app...')}
          </Text>
          <Progress w="full" size="xs" color="green" animated value={100} />
        </Stack>
      </Alert>
    </Container>
  );
};
