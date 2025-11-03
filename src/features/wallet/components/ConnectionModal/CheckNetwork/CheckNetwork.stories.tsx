// ConnectionModal.stories.ts|tsx
import type { Meta, StoryObj } from '@storybook/react';

import { SUPPORTED_NETWORKS, DEFAULT_NETWORK } from '../../../config';
import { NetworkLoadState } from '../../../models/network/types/NetworkLoadState';

import { CheckNetwork } from './CheckNetwork';

const supportedNetworks = SUPPORTED_NETWORKS.filter(Boolean).map(network => {
  return {
    id: network.chainId,
    name: network.chainName,
    isTestChain: network.isTestChain,
    isLocalChain: network.isLocalChain,
  };
});
const defaultNetwork = DEFAULT_NETWORK.chainId;

const meta: Meta<typeof CheckNetwork> = { component: CheckNetwork };
export default meta;

type Story = StoryObj<typeof CheckNetwork>;

// IDLE
export const CheckNetworkIdle: Story = { args: {} };

// NETWORK_REQUESTED
export const NetworkRequested: Story = {
  args: {
    stepState: NetworkLoadState.NETWORK_REQUESTED,
  },
};

// NETWORK_DETECTION_FAILED
export const NetworkDetectionFailed: Story = {
  args: {
    errorMessage: 'Mock Network Detection Failed ErrorCode',
    stepState: NetworkLoadState.NETWORK_DETECTION_FAILED,
  },
};

// WRONG_NETWORK
export const WrongNetwork: Story = {
  args: {
    supportedNetworks,
    defaultNetwork,
    onSwitchNetwork: () => null,
    errorMessage: null,
    stepState: NetworkLoadState.WRONG_NETWORK,
  },
};

// NETWORK_SWITCH_REQUESTED
export const NetworkSwitchRequested: Story = {
  args: {
    stepState: NetworkLoadState.NETWORK_SWITCH_REQUESTED,
  },
};

// NETWORK_SWITCH_REJECTED
export const NetworkSwitchRejected: Story = {
  args: {
    supportedNetworks,
    defaultNetwork,
    onSwitchNetwork: () => null,
    errorMessage: null,
    stepState: NetworkLoadState.NETWORK_SWITCH_REJECTED,
  },
};

// NETWORK_SWITCH_FAILED
export const NetworkSwitchFailed: Story = {
  args: {
    errorMessage: 'Mock Network Switch Failed Error Code',
    stepState: NetworkLoadState.NETWORK_SWITCH_FAILED,
  },
};

// NETWORK_LOADED
export const NetworkLoaded: Story = {
  args: {
    stepState: NetworkLoadState.NETWORK_LOADED,
  },
};
