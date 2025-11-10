import React from 'react';

import { AccountLoadState } from '../../../models/account/types/AccountLoadState';

import { AccountDetectionFailed } from './AccountDetectionFailed';
import { Locked } from './Locked';
import { UnlockFailed } from './UnlockFailed';
import { UnlockRejected } from './UnlockRejected';
import { UnlockRequested } from './UnlockRequested';
import { UnlockWaiting } from './UnlockWaiting';

export interface CheckAccountProps {
  stepState: AccountLoadState;
  errorMessage: string | null;
  onUnlock: () => void;
}

export const CheckAccount: React.FC<CheckAccountProps> = ({
  stepState,
  errorMessage,
  onUnlock,
}) => {
  switch (stepState) {
    case AccountLoadState.ACCOUNT_DETECTION_FAILED:
      return <AccountDetectionFailed errorMessage={errorMessage} />;
    case AccountLoadState.LOCKED:
      return <Locked onUnlock={onUnlock} />;
    case AccountLoadState.UNLOCK_REQUESTED:
      return <UnlockRequested />;
    case AccountLoadState.UNLOCK_REJECTED:
      return <UnlockRejected onUnlock={onUnlock} />;
    case AccountLoadState.WAITING__UNLOCK:
      return <UnlockWaiting />;
    case AccountLoadState.UNLOCK_FAILED:
      return <UnlockFailed errorMessage={errorMessage} />;
    default:
      return null;
  }
};
