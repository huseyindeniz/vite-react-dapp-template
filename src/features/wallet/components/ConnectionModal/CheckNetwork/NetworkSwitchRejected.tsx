import React from 'react';

import { Alert, Stack, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IoIosWarning } from 'react-icons/io';

import { SwitchNetworkMenu } from './SwitchNetworkMenu';

export interface NetworkSwitchRejectedProps {
  supportedNetworks: {
    id: number;
    name: string;
    isTestChain: boolean;
    isLocalChain: boolean;
  }[];
  defaultNetwork: number;
  onSwitchNetwork: (id: number) => void;
}
export const NetworkSwitchRejected: React.FC<NetworkSwitchRejectedProps> = ({
  defaultNetwork,
  supportedNetworks,
  onSwitchNetwork,
}) => {
  const { t } = useTranslation('FeatureWallet');
  return (
    <Alert icon={<IoIosWarning />} title={t('Switch Rejected')} color="yellow">
      <Stack>
        <Text size="sm">
          {t('You rejected the network switch request.')}
          <br />
          {t('Please try again if you want to continue.')}
        </Text>
        <SwitchNetworkMenu
          defaultNetwork={defaultNetwork}
          supportedNetworks={supportedNetworks}
          onSwitchNetwork={onSwitchNetwork}
        />
      </Stack>
    </Alert>
  );
};
