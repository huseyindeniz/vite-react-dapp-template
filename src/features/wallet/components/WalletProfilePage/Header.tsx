import React, { useEffect } from 'react';

import { Title, Divider, Text, Group, Container } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { BlockInfo } from '@/features/wallet/components/BlockInfo/BlockInfo';
import { NetworkLogo } from '@/features/wallet/components/NetworkLogo/NetworkLogo';
import { useActions } from '@/features/wallet/hooks/useActions';
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

  return (
    <>
      {account ? (
        <Container>
          <Title size="xs">{t('User Dashboard')}</Title>
          <Divider />
          <Group>
            <Group>
              {currentNetwork ? (
                <NetworkLogo
                  networkId={currentNetwork?.chainId}
                  networkName={currentNetwork?.chainName}
                />
              ) : null}
              <Text fs="xs">{currentNetwork?.chainName}</Text>
            </Group>
            <BlockInfo />
          </Group>
          <Divider />
        </Container>
      ) : null}
    </>
  );
};
