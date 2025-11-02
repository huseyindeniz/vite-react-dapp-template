import { Card, Container, Stack, Title, Text, List, Center, Box } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { FaLock } from 'react-icons/fa';

import { OAuthButton } from '../OAuthButton/OAuthButton';

export const OAuthProtectionWarning: React.FC = () => {
  const { t } = useTranslation('feature-oauth');
  return (
    <Container size="md" py="xl">
      <Center>
        <Card shadow="lg" padding="xl" radius="md" withBorder maw={600} w="100%">
          <Stack gap="lg" align="center">
            <Box c="red" style={{ fontSize: '64px' }}>
              <FaLock />
            </Box>

            <Title order={1} ta="center">
              {t('401 Unauthorized')}
            </Title>

            <Text size="lg" ta="center" c="dimmed">
              {t('This page requires authentication to access.')}
            </Text>

            <Card w="100%" p="md" withBorder>
              <Stack gap="sm">
                <Text fw={500}>{t('To access this page, you need to:')}</Text>
                <List spacing="xs" size="sm">
                  <List.Item>{t('Click the "Sign in" button below or in the header')}</List.Item>
                  <List.Item>{t('Choose your preferred authentication provider (Google or GitHub)')}</List.Item>
                  <List.Item>{t('Complete the authentication process')}</List.Item>
                  <List.Item>{t('You will be automatically redirected back to this page')}</List.Item>
                </List>
              </Stack>
            </Card>

            <OAuthButton />

            <Text size="xs" c="dimmed" ta="center">
              {t('Your session will be securely managed and you can sign out anytime.')}
            </Text>
          </Stack>
        </Card>
      </Center>
    </Container>
  );
};