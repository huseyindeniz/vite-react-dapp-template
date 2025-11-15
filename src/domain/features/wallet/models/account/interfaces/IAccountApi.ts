import { EventChannel } from 'redux-saga';

import { AccountType } from '@/domain/features/wallet/models/account/types/Account';

export interface IAccountApi {
  isUnlocked: () => Promise<boolean>;
  unlock: () => Promise<void>;
  isSigned: () => Promise<boolean>;
  prepareSignMessage: (message: string) => Promise<string>;
  sign: (message: string) => Promise<void>;
  getAccount: () => Promise<AccountType | null>;
  listenAccountChange: () => EventChannel<string[]> | undefined;
  handleAccountChange: () => Promise<void>;
  reset: () => Promise<void>;
}
