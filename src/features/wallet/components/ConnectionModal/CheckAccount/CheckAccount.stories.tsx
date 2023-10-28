// ConnectionModal.stories.ts|tsx
import type { Meta, StoryObj } from '@storybook/react';

import { AccountLoadState } from '../../../models/account/types/AccountLoadState';

import { CheckAccount } from './CheckAccount';

const meta: Meta<typeof CheckAccount> = { component: CheckAccount };
export default meta;

type Story = StoryObj<typeof CheckAccount>;

// IDLE
export const CheckAccountIdle: Story = {
  args: {},
};

// ACCOUNT_REQUESTED
export const AccountRequested: Story = {
  args: {
    stepState: AccountLoadState.ACCOUNT_REQUESTED,
  },
};

// ACCOUNT_DETECTION_FAILED
export const AccountDetectionFailed: Story = {
  args: {
    stepState: AccountLoadState.ACCOUNT_DETECTION_FAILED,
    errorMessage: 'Mock Account Detection Failed ErrorCode',
    onUnlock: () => null,
  },
};

// LOCKED
export const Locked: Story = {
  args: {
    stepState: AccountLoadState.LOCKED,
    errorMessage: null,
    onUnlock: () => null,
  },
};

// UNLOCK_REQUESTED
export const UnlockRequested: Story = {
  args: {
    stepState: AccountLoadState.UNLOCK_REQUESTED,
    errorMessage: null,
    onUnlock: () => null,
  },
};

// UNLOCK_REJECTED
export const UnlockRejected: Story = {
  args: {
    stepState: AccountLoadState.UNLOCK_REJECTED,
    errorMessage: null,
    onUnlock: () => null,
  },
};

// UNLOCK_WAITING
export const UnlockWaiting: Story = {
  args: {
    stepState: AccountLoadState.WAITING__UNLOCK,
    errorMessage: null,
    onUnlock: () => null,
  },
};

// UNLOCK_FAILED
export const UnlockFailed: Story = {
  args: {
    stepState: AccountLoadState.UNLOCK_FAILED,
    errorMessage: 'Mock Unlock Failed Error Code',
    onUnlock: () => null,
  },
};

// ACCOUNT_LOADED
export const AccountLoaded: Story = {
  args: {
    stepState: AccountLoadState.ACCOUNT_LOADED,
  },
};
