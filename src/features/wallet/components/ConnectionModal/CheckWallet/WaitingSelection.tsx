import React from 'react';

import {
  Box,
  Button,
  Text,
  HStack,
  Divider,
  TableContainer,
  Table,
  Tr,
  Thead,
  Th,
  Tbody,
  Td,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { AlertMessage } from '@/features/ui/components/AlertMessage/AlertMessage';
import { Web3Wallet } from '@/features/wallet/models/provider/types/Web3Wallet';
import { SupportedWallets } from '@/services/interfaces/IWalletProviderApi';

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
  const { t } = useTranslation('FeatureWallet');
  return (
    <>
      <AlertMessage status="info" title={t('Multiple Web3 Wallet Detected')}>
        {t(
          'The following Web3 wallet extensions dedected in your browser. You can select the wallet you want to connect.'
        )}
      </AlertMessage>
      <TableContainer mt={2}>
        <Table variant="simple" size={'sm'}>
          <Thead>
            <Tr>
              <Th>{t('Wallet')}</Th>
              <Th>{t('Select')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {wallets.map(w => (
              <Tr key={w.name}>
                <Td>
                  <HStack>
                    <WalletLogo label={w.label} wallet={w.name} />
                    <Text fontSize="xs">{w.label}</Text>
                  </HStack>
                </Td>
                <Td>
                  <Button
                    size="xs"
                    onClick={() => onWalletSelect(w.name)}
                    variant="solid"
                    colorScheme="yellow"
                  >
                    {t('Select')}
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Divider />
      <Box textAlign="right" mt={2}>
        <Button size="xs" onClick={() => onCancel()} variant="solid">
          {t('Cancel')}
        </Button>
      </Box>
    </>
  );
};
