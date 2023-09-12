import type { Meta, StoryObj } from '@storybook/react';
import { composeStories } from '@storybook/react';

import * as checkAccountStories from '../Steps/CheckAccount.stories';
import * as checkNetworkStories from '../Steps/CheckNetwork.stories';
import * as checkSignStories from '../Steps/CheckSign.stories';
import * as checkWalletStories from '../Steps/CheckWallet.stories';

import { Modal } from './Modal';

const meta: Meta<typeof Modal> = { component: Modal };
export default meta;

type Story = StoryObj<typeof Modal>;

// STEP: CHECK WALLET

const {
  CheckWalletIdle,
  InitRequested,
  InitFailed,
  NotSupported,
  Initialized,
} = composeStories(checkWalletStories);

export const CheckWalletCheckWalletIdle: Story = {
  args: {
    isOpen: true,
    activeStep: 0,
    checkWalletContent: <CheckWalletIdle />,
  },
};

export const CheckWalletInitRequested: Story = {
  args: {
    isOpen: true,
    activeStep: 0,
    stepState: 'loading',
    checkWalletContent: <InitRequested />,
  },
};

export const CheckWalletInitFailed: Story = {
  args: {
    isOpen: true,
    activeStep: 0,
    stepState: 'error',
    checkWalletContent: <InitFailed />,
  },
};

export const CheckWalletNotSupported: Story = {
  args: {
    isOpen: true,
    activeStep: 0,
    stepState: 'error',
    checkWalletContent: <NotSupported />,
  },
};

export const CheckWalletInitialized: Story = {
  args: {
    isOpen: true,
    activeStep: 0,
    checkWalletContent: <Initialized />,
  },
};

// STEP: CHECK ACCOUNT

const {
  CheckAccountIdle,
  AccountRequested,
  AccountDetectionFailed,
  Locked,
  UnlockRequested,
  UnlockRejected,
  UnlockWaiting,
  UnlockFailed,
  AccountLoaded,
} = composeStories(checkAccountStories);

export const CheckAccountCheckAccountIdle: Story = {
  args: {
    isOpen: true,
    activeStep: 1,
    checkAccountContent: <CheckAccountIdle />,
  },
};

export const CheckAccountAccountRequested: Story = {
  args: {
    isOpen: true,
    activeStep: 1,
    stepState: 'loading',
    checkAccountContent: <AccountRequested />,
  },
};

export const CheckAccountAccountDetectionFailed: Story = {
  args: {
    isOpen: true,
    activeStep: 1,
    stepState: 'error',
    checkAccountContent: <AccountDetectionFailed />,
  },
};

export const CheckAccountLocked: Story = {
  args: {
    isOpen: true,
    activeStep: 1,
    stepState: 'error',
    checkAccountContent: <Locked />,
  },
};

export const CheckAccountUnlockRequested: Story = {
  args: {
    isOpen: true,
    activeStep: 1,
    stepState: 'loading',
    checkAccountContent: <UnlockRequested />,
  },
};

export const CheckAccountUnlockRejected: Story = {
  args: {
    isOpen: true,
    activeStep: 1,
    stepState: 'error',
    checkAccountContent: <UnlockRejected />,
  },
};

export const CheckAccountUnlockWaiting: Story = {
  args: {
    isOpen: true,
    activeStep: 1,
    stepState: 'error',
    checkAccountContent: <UnlockWaiting />,
  },
};

export const CheckAccountUnlockFailed: Story = {
  args: {
    isOpen: true,
    activeStep: 1,
    stepState: 'error',
    checkAccountContent: <UnlockFailed />,
  },
};

export const CheckAccountAccountLoaded: Story = {
  args: {
    isOpen: true,
    activeStep: 1,
    checkAccountContent: <AccountLoaded />,
  },
};

// STEP: CHECK NETWORK

const {
  CheckNetworkIdle,
  NetworkRequested,
  NetworkDetectionFailed,
  WrongNetwork,
  NetworkSwitchRequested,
  NetworkSwitchRejected,
  NetworkSwitchFailed,
  NetworkLoaded,
} = composeStories(checkNetworkStories);

export const CheckNetworkCheckNetworkIdle: Story = {
  args: {
    isOpen: true,
    activeStep: 2,
    checkNetworkContent: <CheckNetworkIdle />,
  },
};

export const CheckNetworkNetworkRequested: Story = {
  args: {
    isOpen: true,
    activeStep: 2,
    stepState: 'loading',
    checkNetworkContent: <NetworkRequested />,
  },
};

export const CheckNetworkNetworkDetectionFailed: Story = {
  args: {
    isOpen: true,
    activeStep: 2,
    stepState: 'error',
    checkNetworkContent: <NetworkDetectionFailed />,
  },
};

export const CheckNetworkWrongNetwork: Story = {
  args: {
    isOpen: true,
    activeStep: 2,
    stepState: 'error',
    checkNetworkContent: <WrongNetwork />,
  },
};

export const CheckNetworkSwitchRequested: Story = {
  args: {
    isOpen: true,
    activeStep: 2,
    stepState: 'loading',
    checkNetworkContent: <NetworkSwitchRequested />,
  },
};

export const CheckNetworkSwitchRejected: Story = {
  args: {
    isOpen: true,
    activeStep: 2,
    stepState: 'error',
    checkNetworkContent: <NetworkSwitchRejected />,
  },
};

export const CheckNetworkSwitchFailed: Story = {
  args: {
    isOpen: true,
    activeStep: 2,
    stepState: 'error',
    checkNetworkContent: <NetworkSwitchFailed />,
  },
};

export const CheckNetworkLoaded: Story = {
  args: {
    isOpen: true,
    activeStep: 2,
    checkNetworkContent: <NetworkLoaded />,
  },
};

// STEP: CHECK SIGN

const {
  CheckSignIdle,
  NotSigned,
  SignRequested,
  SignRejected,
  SignTimedOut,
  SignFailed,
  Signed,
} = composeStories(checkSignStories);

export const CheckSignCheckSignIdle: Story = {
  args: {
    isOpen: true,
    activeStep: 3,
    checkSignContent: <CheckSignIdle />,
  },
};

export const CheckSignNotSigned: Story = {
  args: {
    isOpen: true,
    activeStep: 3,
    stepState: 'error',
    checkSignContent: <NotSigned />,
  },
};

export const CheckSignSignRequested: Story = {
  args: {
    isOpen: true,
    activeStep: 3,
    stepState: 'loading',
    checkSignContent: <SignRequested />,
  },
};

export const CheckSignSignRejected: Story = {
  args: {
    isOpen: true,
    activeStep: 3,
    stepState: 'error',
    checkSignContent: <SignRejected />,
  },
};

export const CheckSignSignTimedOut: Story = {
  args: {
    isOpen: true,
    activeStep: 3,
    stepState: 'error',
    checkSignContent: <SignTimedOut />,
  },
};

export const CheckSignSignFailed: Story = {
  args: {
    isOpen: true,
    activeStep: 3,
    stepState: 'error',
    checkSignContent: <SignFailed />,
  },
};

export const CheckSignSigned: Story = {
  args: {
    isOpen: true,
    activeStep: 3,
    checkSignContent: <Signed />,
  },
};
