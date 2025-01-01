import { Alert, Container, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IoIosWarning } from 'react-icons/io';

export const UnlockWaiting = () => {
  const { t } = useTranslation('FeatureWallet');
  return (
    <Container>
      <Alert icon={<IoIosWarning />} title={t('Waiting Unlock')} color="yellow">
        <Text size="sm">
          {t("You haven't unlocked your wallet yet.")}
          <br />
          {t(
            'Please close this dialog, open your Web3 wallet, unlock it, and click connect button again.'
          )}
        </Text>
      </Alert>
    </Container>
  );
};
