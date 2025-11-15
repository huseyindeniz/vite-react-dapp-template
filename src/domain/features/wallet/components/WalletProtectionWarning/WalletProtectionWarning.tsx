import {
  Card,
  Container,
  Stack,
  Title,
  Text,
  List,
  Center,
  Box,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { FaWallet } from 'react-icons/fa';

import { ConnectButton } from '../ConnectButton/ConnectButton';

export const WalletProtectionWarning: React.FC = () => {
  const { t } = useTranslation('feature-wallet');
  return (
    <Container size="md">
      <Center>
        <Card
          shadow="lg"
          padding="xl"
          radius="md"
          withBorder
          maw={600}
          w="100%"
        >
          <Stack gap="lg" align="center">
            <Box c="blue" style={{ fontSize: '64px' }}>
              <FaWallet />
            </Box>

            <Title order={1} ta="center">
              {t('401 Unauthorized')}
            </Title>

            <Text size="lg" ta="center" c="dimmed">
              {t('This page requires a Web3 wallet connection to access.')}
            </Text>

            <Card w="100%" p="md" withBorder>
              <Stack gap="sm">
                <Text fw={500}>{t('To access this page, you need to:')}</Text>
                <List spacing="xs" size="sm">
                  <List.Item>
                    {t('Click the "Connect" button below or in the header')}
                  </List.Item>
                  <List.Item>
                    {t(
                      'Choose your Web3 wallet (MetaMask, Coinbase, Core, or Rabby)'
                    )}
                  </List.Item>
                  <List.Item>
                    {t('Approve the connection request in your wallet')}
                  </List.Item>
                  <List.Item>
                    {t(
                      'Sign the login message to verify your wallet ownership'
                    )}
                  </List.Item>
                  <List.Item>
                    {t(
                      'You will be automatically redirected back to this page'
                    )}
                  </List.Item>
                </List>
              </Stack>
            </Card>

            <ConnectButton />

            <Text size="xs" c="dimmed" ta="center">
              {t(
                'Your wallet connection is secure and you can disconnect anytime.'
              )}
            </Text>
          </Stack>
        </Card>
      </Center>
    </Container>
  );
};
