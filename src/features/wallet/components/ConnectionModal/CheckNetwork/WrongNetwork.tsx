import React from 'react';

import { Alert, Stack, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IoIosWarning } from 'react-icons/io';

import { SwitchNetworkMenu } from './SwitchNetworkMenu';

export interface WrongNetworkProps {
  supportedNetworks: {
    id: number;
    name: string;
    isTestChain: boolean;
    isLocalChain: boolean;
  }[];
  defaultNetwork: number;
  onSwitchNetwork: (id: number) => void;
}
export const WrongNetwork: React.FC<WrongNetworkProps> = ({
  defaultNetwork,
  supportedNetworks,
  onSwitchNetwork,
}) => {
  const { t } = useTranslation('feature-wallet');
  return (
    <Alert icon={<IoIosWarning />} title={t('Wrong Network')} color="yellow">
      <Stack>
        <Text size="sm">
          {t('Current network is not supported by this app.')}
          <br />
          {t(
            'If you want to continue, please switch to any supported network.'
          )}
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
