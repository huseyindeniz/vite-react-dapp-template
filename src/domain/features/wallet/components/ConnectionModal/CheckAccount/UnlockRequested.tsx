import { Alert, Container, Progress, Stack, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IoIosInformationCircle } from 'react-icons/io';

export const UnlockRequested = () => {
  const { t } = useTranslation('feature-wallet');
  return (
    <Container>
      <Alert icon={<IoIosInformationCircle />} title={t('Unlock Requested')}>
        <Stack>
          <Text size="sm">
            {t('Waiting for the unlock wallet request to be accepted.')}
            <br />
            {t('Please check your Web3 wallet.')}
          </Text>
          <Progress w="full" size="xs" animated color="blue" value={100} />
        </Stack>
      </Alert>
    </Container>
  );
};
