import React from 'react';

import { Box, VStack, Button, Select } from '@chakra-ui/react';
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
  const { t } = useTranslation('FeatureWallet');
  const [selectedNetwork, setSelectedNetwork] =
    React.useState<number>(defaultNetwork);
  return (
    <VStack spacing={2}>
      <Select
        size="md"
        outline="filled"
        bg="tomato"
        borderColor="tomato"
        defaultValue={defaultNetwork}
        onChange={event => setSelectedNetwork(parseInt(event.target.value))}
      >
        {supportedNetworks.map(network => {
          let networkName = network.name;
          networkName = network.isLocalChain
            ? `(Local) ${networkName}`
            : network.isTestChain
            ? `(TestNet) ${networkName}`
            : networkName;
          return (
            <option key={network.id} value={network.id}>
              {networkName}
            </option>
          );
        })}
      </Select>
      <Box>
        <Button
          variant="solid"
          colorScheme="yellow"
          onClick={() => onSwitchNetwork(selectedNetwork)}
        >
          {t('Switch Network')}
        </Button>
      </Box>
    </VStack>
  );
};
