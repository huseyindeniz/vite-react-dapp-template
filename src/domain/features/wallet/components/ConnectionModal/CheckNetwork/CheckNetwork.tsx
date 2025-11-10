import React from 'react';

import { NetworkLoadState } from '../../../models/network/types/NetworkLoadState';

import { NetworkDetectionFailed } from './NetworkDetectionFailed';
import { NetworkSwitchFailed } from './NetworkSwitchFailed';
import { NetworkSwitchRejected } from './NetworkSwitchRejected';
import { NetworkSwitchRequested } from './NetworkSwitchRequested';
import { WrongNetwork } from './WrongNetwork';

export interface CheckNetworkProps {
  supportedNetworks: {
    id: number;
    name: string;
    isTestChain: boolean;
    isLocalChain: boolean;
  }[];
  defaultNetwork: number;
  stepState: NetworkLoadState;
  errorMessage: string | null;
  onSwitchNetwork: (id: number) => void;
}

export const CheckNetwork: React.FC<CheckNetworkProps> = ({
  supportedNetworks,
  defaultNetwork,
  stepState,
  errorMessage,
  onSwitchNetwork,
}) => {
  switch (stepState) {
    case NetworkLoadState.NETWORK_DETECTION_FAILED:
      return <NetworkDetectionFailed errorMessage={errorMessage} />;
    case NetworkLoadState.WRONG_NETWORK:
      return (
        <WrongNetwork
          defaultNetwork={defaultNetwork}
          supportedNetworks={supportedNetworks}
          onSwitchNetwork={onSwitchNetwork}
        />
      );
    case NetworkLoadState.NETWORK_SWITCH_REQUESTED:
      return <NetworkSwitchRequested />;
    case NetworkLoadState.NETWORK_SWITCH_REJECTED:
      return (
        <NetworkSwitchRejected
          defaultNetwork={defaultNetwork}
          supportedNetworks={supportedNetworks}
          onSwitchNetwork={onSwitchNetwork}
        />
      );
    case NetworkLoadState.NETWORK_SWITCH_FAILED:
      return <NetworkSwitchFailed errorMessage={errorMessage} />;
    default:
      return null;
  }
};
