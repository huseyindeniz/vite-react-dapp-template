import { Alert, Container, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IoIosWarning } from 'react-icons/io';

export const DetectingWalletsFailed = () => {
  const { t } = useTranslation('FeatureWallet');
  return (
    <Container>
      <Alert icon={<IoIosWarning />} title={t('Detection Failed')} color="red">
        <Text size="sm">{t('Web3 wallet detection failed.')}</Text>
      </Alert>
    </Container>
  );
};
