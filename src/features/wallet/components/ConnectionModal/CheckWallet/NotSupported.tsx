import React from 'react';

import {
  Box,
  Link,
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
import { FaExternalLinkAlt } from 'react-icons/fa';

import { AlertMessage } from '@/features/ui/components/AlertMessage/AlertMessage';
import { SUPPORTED_WALLETS } from '@/features/wallet/config';

import { WalletLogo } from '../../WalletLogo/WalletLogo';

interface NotSupportedProps {
  onCancel: () => void;
}
export const NotSupported: React.FC<NotSupportedProps> = ({ onCancel }) => {
  const { t } = useTranslation('FeatureWallet');
  return (
    <>
      <AlertMessage status="warning" title={t('No Web3 Wallet Detected')}>
        {t(
          'Please install any compatible Web3 wallet extension for your browser from the official links below and try again to use this dapp.'
        )}
      </AlertMessage>
      <TableContainer mt={2}>
        <Table variant="simple" size={'sm'}>
          <Thead>
            <Tr>
              <Th>{t('Wallet')}</Th>
              <Th>{t('Link')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {SUPPORTED_WALLETS.map(w => (
              <Tr key={w.name}>
                <Td>
                  <HStack>
                    <WalletLogo label={w.label} wallet={w.name} />
                    <Text fontSize="xs">{w.label}</Text>
                  </HStack>
                </Td>
                <Td>
                  <Button
                    mr={1}
                    size="xs"
                    variant="solid"
                    rightIcon={<FaExternalLinkAlt />}
                  >
                    <Link href={w.link} isExternal>
                      {t('Install')}
                    </Link>
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Divider />
      <Box textAlign="right" mt={2}>
        <Button
          size="xs"
          onClick={() => onCancel()}
          variant="solid"
          colorScheme="yellow"
        >
          {t('Cancel')}
        </Button>
      </Box>
    </>
  );
};
