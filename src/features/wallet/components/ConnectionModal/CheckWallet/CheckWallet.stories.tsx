// ConnectionModal.stories.ts|tsx
import { Meta, StoryObj } from '@storybook/react';

import { SUPPORTED_WALLETS } from '@/features/wallet/config';

import { ProviderLoadState } from '../../../models/provider/types/ProviderLoadState';

import { CheckWallet } from './CheckWallet';

const meta: Meta<typeof CheckWallet> = { component: CheckWallet };
export default meta;

type Story = StoryObj<typeof CheckWallet>;

// IDLE
export const CheckWalletIdle: Story = { args: {} };

// DETECTING_WALLETS
export const DetectingWallets: Story = {
  args: {
    stepState: ProviderLoadState.DETECTING_WALLETS,
  },
};

// WALLET_DEDECTION_FAILED
export const WalletDetectionFailed: Story = {
  args: {
    stepState: ProviderLoadState.WALLET_DEDECTION_FAILED,
  },
};

// WAITING_SELECTION
export const WaitingSelection: Story = {
  args: {
    stepState: ProviderLoadState.WAITING_WALLET_SELECTION,
    installedWallets: SUPPORTED_WALLETS,
  },
};

// INIT_REQUESTED
export const InitRequested: Story = {
  args: {
    stepState: ProviderLoadState.REQUESTED,
  },
};

// NOT_SUPPORTED
export const NotSupported: Story = {
  args: {
    stepState: ProviderLoadState.NOT_SUPPORTED,
  },
};

// INIT_FAILED
export const InitFailed: Story = {
  args: {
    stepState: ProviderLoadState.FAILED,
    errorMessage: 'Mock init failed error message',
  },
};

// INITIALIZED
export const Initialized: Story = {
  args: {
    stepState: ProviderLoadState.INITIALIZED,
  },
};
