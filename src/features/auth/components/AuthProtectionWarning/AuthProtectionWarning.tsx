import { Alert, Container, Stack, Title, Divider } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IoIosWarning } from 'react-icons/io';

export const AuthProtectionWarning: React.FC = () => {
  const { t } = useTranslation('FeatureAuth');
  return (
    <Container>
      <Stack gap={5} align="center">
        <Title>{t('401 Unauthorized')}</Title>
        <Divider />
        <Alert icon={<IoIosWarning />} title="Access Denied">
          {t('You need to log in to see this page.')}
        </Alert>
      </Stack>
    </Container>
  );
};