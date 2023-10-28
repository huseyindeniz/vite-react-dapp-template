import React from 'react';

import { Box, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { AlertMessage } from '@/features/ui/components/AlertMessage/AlertMessage';

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
    <AlertMessage status="warning" title={t('Switch Rejected')}>
      <VStack>
        <Box>
          {t('You rejected the network switch request.')}
          <br />
          {t('Please try again if you want to continue.')}
        </Box>
        <SwitchNetworkMenu
          defaultNetwork={defaultNetwork}
          supportedNetworks={supportedNetworks}
          onSwitchNetwork={onSwitchNetwork}
        />
      </VStack>
    </AlertMessage>
  );
};
