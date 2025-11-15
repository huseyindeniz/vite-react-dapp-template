import React from 'react';

import { Box, Stack, Button, Select, ComboboxData } from '@mantine/core';
import { useTranslation } from 'react-i18next';

export interface SwitchNetworkMenuProps {
  supportedNetworks: {
    id: number;
    name: string;
    isTestChain: boolean;
    isLocalChain: boolean;
  }[];
  defaultNetwork: number;
  onSwitchNetwork: (id: number) => void;
}

export const SwitchNetworkMenu: React.FC<SwitchNetworkMenuProps> = ({
  defaultNetwork,
  supportedNetworks,
  onSwitchNetwork,
}) => {
  const { t } = useTranslation('feature-wallet');
  const [selectedNetwork, setSelectedNetwork] =
    React.useState<number>(defaultNetwork);

  const networkOptions: ComboboxData = supportedNetworks.map(network => {
    let networkName = network.name;
    networkName = network.isLocalChain
      ? `(Local) ${networkName}`
      : network.isTestChain
        ? `(TestNet) ${networkName}`
        : networkName;
    return { value: network.id.toString(), label: networkName };
  });

  return (
    <Stack gap="sm">
      <Select
        defaultValue={defaultNetwork.toString()}
        onChange={(value, _option) =>
          value ? setSelectedNetwork(parseInt(value, 10)) : null
        }
        data={networkOptions}
      />
      <Box>
        <Button
          variant="filled"
          color="yellow"
          autoContrast
          onClick={() => onSwitchNetwork(selectedNetwork)}
        >
          {t('Switch Network')}
        </Button>
      </Box>
    </Stack>
  );
};
