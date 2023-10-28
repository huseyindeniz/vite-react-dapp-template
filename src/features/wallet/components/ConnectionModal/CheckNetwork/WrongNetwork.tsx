import React from 'react';

import { Box, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { AlertMessage } from '@/features/ui/components/AlertMessage/AlertMessage';

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
  const { t } = useTranslation('FeatureWallet');
  return (
    <AlertMessage status="warning" title={t('Wrong Network')}>
      <VStack>
        <Box>
          {t('Current network is not supported by this app.')}
          <br />
          {t(
            'If you want to continue, please switch to any supported network.'
          )}
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
