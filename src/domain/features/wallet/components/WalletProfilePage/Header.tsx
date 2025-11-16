import React, { useEffect } from 'react';

import { Alert, Container, Group, Paper, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { MdError } from 'react-icons/md';

import { BlockInfo } from '@/domain/features/wallet/components/BlockInfo/BlockInfo';
import { NetworkLogo } from '@/domain/features/wallet/components/NetworkLogo/NetworkLogo';
import { useActions } from '@/domain/features/wallet/hooks/useActions';
import { useTypedSelector } from '@/hooks/useTypedSelector';

export const Header: React.FC = () => {
  const { t } = useTranslation('feature-wallet');
  const actions = useActions();
  const account = useTypedSelector(state => state.wallet.account);
  const currentNetwork = useTypedSelector(
    state => state.wallet.network.network
  );

  useEffect(() => {
    const interval = setInterval(() => {
      actions.latestBlock();
    }, 15000);
    return () => clearInterval(interval);
  }, [currentNetwork]);

  if (!account || !account.account) {
    return (
      <Container>
        <Alert icon={<MdError size={16} />} title={t('Error')} color="red">
          {t('No wallet connected. Please connect your wallet.')}
        </Alert>
      </Container>
    );
  }

  return (
    <Paper shadow="sm" p="md" withBorder>
      <Group justify="space-between" wrap="nowrap">
        <Group gap="sm">
          {currentNetwork && (
            <NetworkLogo
              networkId={currentNetwork.chainId}
              networkName={currentNetwork.chainName}
            />
          )}
          <div>
            <Text fw={500}>
              {currentNetwork?.chainName || t('Unknown Network')}
            </Text>
            <Text size="xs" c="dimmed">
              {account.account.shortAddress}
            </Text>
          </div>
        </Group>
        <BlockInfo />
      </Group>
    </Paper>
  );
};
