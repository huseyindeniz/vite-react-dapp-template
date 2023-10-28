import React from 'react';

import { DISABLE_WALLET_SIGN } from '../../../config';
import { AccountSignState } from '../../../models/account/types/AccountSignState';

import { NotSigned } from './NotSigned';
import { Signed } from './Signed';
import { SignFailed } from './SignFailed';
import { SignRejected } from './SignRejected';
import { SignRequested } from './SignRequested';
import { SignTimedOut } from './SignTimedOut';
import { WalletAccountLoaded } from './WalletAccountLoaded';

export interface CheckSignProps {
  stepState: AccountSignState;
  errorMessage: string | null;
  signCounter: number;
  onSign: (message: string) => void;
  onDisconnect: () => void;
}

export const CheckSign: React.FC<CheckSignProps> = ({
  stepState,
  errorMessage,
  signCounter,
  onSign,
  onDisconnect,
}) => {
  switch (stepState) {
    case AccountSignState.NOT_SIGNED:
      return <NotSigned onSign={onSign} onDisconnect={onDisconnect} />;
    case AccountSignState.SIGN_REQUESTED:
      return <SignRequested signCounter={signCounter} />;
    case AccountSignState.SIGN_REJECTED:
      return <SignRejected onSign={onSign} onDisconnect={onDisconnect} />;
    case AccountSignState.SIGN_TIMED_OUT:
      return <SignTimedOut onSign={onSign} onDisconnect={onDisconnect} />;
    case AccountSignState.SIGN_FAILED:
      return <SignFailed errorMessage={errorMessage} />;
    case AccountSignState.SIGNED:
      return DISABLE_WALLET_SIGN ? <WalletAccountLoaded /> : <Signed />;
    default:
      return null;
  }
};
