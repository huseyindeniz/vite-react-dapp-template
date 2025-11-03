import React from 'react';

import {
  Alert,
  Box,
  Button,
  Text,
  Group,
  Divider,
  Table,
  Container,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IoIosInformationCircle } from 'react-icons/io';

import { SupportedWallets } from '@/features/wallet/models/provider/types/SupportedWallets';
import { Web3Wallet } from '@/features/wallet/models/provider/types/Web3Wallet';

import { WalletLogo } from '../../WalletLogo/WalletLogo';

interface WaitingSelectionProps {
  wallets: Web3Wallet[];
  onWalletSelect: (wallet: SupportedWallets) => void;
  onCancel: () => void;
}
export const WaitingSelection: React.FC<WaitingSelectionProps> = ({
  wallets,
  onWalletSelect,
  onCancel,
}) => {
  const { t } = useTranslation('feature-wallet');
  return (
    <Container mb={4}>
      <Alert
        icon={<IoIosInformationCircle />}
        title={t('Multiple Web3 Wallet Detected')}
      >
        <Text size="sm">
          {t(
            'The following Web3 wallet extensions dedected in your browser. You can select the wallet you want to connect.'
          )}
        </Text>
        <Table.ScrollContainer minWidth={300}>
          <Table mt={10} withTableBorder={false}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t('Wallet')}</Table.Th>
                <Table.Th>{t('Select')}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {wallets.map(w => (
                <Table.Tr key={w.name}>
                  <Table.Td>
                    <Group>
                      <WalletLogo label={w.label} wallet={w.name} />
                      <Text size="xs">{w.label}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Button
                      size="xs"
                      onClick={() => onWalletSelect(w.name)}
                      variant="filled"
                      color="yellow"
                      autoContrast
                    >
                      {t('Select')}
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
        <Divider />
        <Box mt="sm" ta="right">
          <Button size="xs" onClick={() => onCancel()} variant="default">
            {t('Cancel')}
          </Button>
        </Box>
      </Alert>
    </Container>
  );
};
