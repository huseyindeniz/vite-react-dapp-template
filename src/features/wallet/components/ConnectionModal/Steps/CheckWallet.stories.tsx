// ConnectionModal.stories.ts|tsx
import type { Meta, StoryObj } from '@storybook/react';

import { ProviderLoadState } from '../../../models/provider/types/ProviderLoadState';

import { CheckWallet } from './CheckWallet';

const meta: Meta<typeof CheckWallet> = { component: CheckWallet };
export default meta;

type Story = StoryObj<typeof CheckWallet>;

// IDLE
export const CheckWalletIdle: Story = { args: {} };

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
  },
};

// INITIALIZED
export const Initialized: Story = {
  args: {
    stepState: ProviderLoadState.INITIALIZED,
  },
};
