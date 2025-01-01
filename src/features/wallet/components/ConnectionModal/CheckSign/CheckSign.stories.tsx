// ConnectionModal.stories.ts|tsx
import type { Meta, StoryObj } from '@storybook/react';

import { AccountSignState } from '../../../models/account/types/AccountSignState';

import { CheckSign } from './CheckSign';

const meta: Meta<typeof CheckSign> = { component: CheckSign };
export default meta;

type Story = StoryObj<typeof CheckSign>;

// IDLE
export const CheckSignIdle: Story = { args: {} };

// NOT_SIGNED
export const NotSigned: Story = {
  args: {
    stepState: AccountSignState.NOT_SIGNED,
  },
};

// SIGN_REQUESTED
export const SignInitialized: Story = {
  args: {
    stepState: AccountSignState.SIGN_INITIALIZED,
  },
};

// SIGN_REQUESTED
export const SignRequested: Story = {
  args: {
    signCounter: 45,
    stepState: AccountSignState.SIGN_REQUESTED,
  },
};

// SIGN_REJECTED
export const SignRejected: Story = {
  args: {
    stepState: AccountSignState.SIGN_REJECTED,
  },
};

// SIGN_TIMED_OUT
export const SignTimedOut: Story = {
  args: {
    stepState: AccountSignState.SIGN_TIMED_OUT,
  },
};

// SIGN_FAILED
export const SignFailed: Story = {
  args: {
    stepState: AccountSignState.SIGN_FAILED,
    errorMessage: 'Mock Sign Failed Error Code',
  },
};

// SIGNED
export const Signed: Story = {
  args: {
    stepState: AccountSignState.SIGNED,
  },
};
