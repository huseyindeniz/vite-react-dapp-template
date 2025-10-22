import React from 'react';

import { SupportedWallets } from '@/features/wallet/models/provider/IProviderApi';
import { Web3Wallet } from '@/features/wallet/models/provider/types/Web3Wallet';

import { ProviderLoadState } from '../../../models/provider/types/ProviderLoadState';

import { DetectingWallets } from './DetectingWallets';
import { DetectingWalletsFailed } from './DetectingWalletsFailed';
import { Failed } from './Failed';
import { NotSupported } from './NotSupported';
import { WaitingSelection } from './WaitingSelection';

export interface CheckWalletProps {
  stepState: ProviderLoadState;
  installedWallets: Web3Wallet[];
  errorMessage: string | null;
  onWalletSelect: (wallet: SupportedWallets) => void;
  onCancel: () => void;
}

export const CheckWallet: React.FC<CheckWalletProps> = ({
  stepState,
  installedWallets,
  errorMessage,
  onWalletSelect,
  onCancel,
}) => {
  switch (stepState) {
    case ProviderLoadState.IDLE:
      return null;
    case ProviderLoadState.DETECTING_WALLETS:
      return <DetectingWallets />;
    case ProviderLoadState.WALLET_DEDECTION_FAILED:
      return <DetectingWalletsFailed />;
    case ProviderLoadState.WAITING_WALLET_SELECTION:
      return (
        <WaitingSelection
          wallets={installedWallets}
          onCancel={onCancel}
          onWalletSelect={onWalletSelect}
        />
      );
    case ProviderLoadState.REQUESTED:
      return null;
    case ProviderLoadState.NOT_SUPPORTED:
      return <NotSupported onCancel={onCancel} />;
    case ProviderLoadState.FAILED:
      return <Failed errorMessage={errorMessage} />;
    case ProviderLoadState.INITIALIZED:
      return null;
    default:
      return null;
  }
};
