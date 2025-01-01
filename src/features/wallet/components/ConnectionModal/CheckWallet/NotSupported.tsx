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
import { FaExternalLinkAlt } from 'react-icons/fa';
import { IoIosWarning } from 'react-icons/io';

import { SUPPORTED_WALLETS } from '@/features/wallet/config';

import { WalletLogo } from '../../WalletLogo/WalletLogo';

interface NotSupportedProps {
  onCancel: () => void;
}
export const NotSupported: React.FC<NotSupportedProps> = ({ onCancel }) => {
  const { t } = useTranslation('FeatureWallet');
  return (
    <Container>
      <Alert
        icon={<IoIosWarning />}
        title={t('No Web3 Wallet Detected')}
        color="yellow"
      >
        <Text size="sm">
          {t(
            'Please install any compatible Web3 wallet extension for your browser from the official links below and try again to use this dapp.'
          )}
        </Text>
        <Table.ScrollContainer minWidth={300} mt={4}>
          <Table variant="simple">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t('Wallet')}</Table.Th>
                <Table.Th>{t('Link')}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {SUPPORTED_WALLETS.map(w => (
                <Table.Tr key={w.name}>
                  <Table.Td>
                    <Group>
                      <WalletLogo label={w.label} wallet={w.name} />
                      <Text size="xs">{w.label}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Button
                      mr={1}
                      component="a"
                      size="xs"
                      href={w.link}
                      variant="default"
                      target="_blank"
                      rightSection={<FaExternalLinkAlt />}
                    >
                      {t('Install')}
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
        <Divider />
        <Box mt="sm" ta="right">
          <Button
            size="xs"
            onClick={() => onCancel()}
            variant="filled"
            color="yellow"
            autoContrast
          >
            {t('Cancel')}
          </Button>
        </Box>
      </Alert>
    </Container>
  );
};
