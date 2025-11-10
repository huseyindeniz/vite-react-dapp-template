import { Alert, Container, Progress, Stack, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IoIosInformationCircle } from 'react-icons/io';

export const DetectingWallets = () => {
  const { t } = useTranslation('feature-wallet');
  return (
    <Container>
      <Alert
        icon={<IoIosInformationCircle />}
        title={t('Detecting wallets')}
        color="blue"
      >
        <Stack>
          <Text size="sm">{t('Detecting installed Web3 wallets.')}</Text>
          <Progress w="full" size="xs" color="blue" value={100} animated />
        </Stack>
      </Alert>
    </Container>
  );
};
