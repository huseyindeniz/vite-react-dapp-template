import { Alert, Box, Progress, Stack } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IoIosWarning } from 'react-icons/io';

export const WalletAccountLoaded = () => {
  const { t } = useTranslation('FeatureWallet');
  return (
    <Alert icon={<IoIosWarning />} title={t('Load Account')}>
      <Stack>
        <Box>
          {t('Your wallet account connected successfuly.')}
          <br />
          {t('Redirecting to app...')}
        </Box>
        <Progress w="full" size="xs" color="green" animated value={100} />
      </Stack>
    </Alert>
  );
};
