import { EventChannel } from 'redux-saga';

import { AccountType } from '@/features/wallet/models/account/types/Account';

export interface IWalletAccountApi {
  isUnlocked(): Promise<boolean>;
  unlock(): Promise<void>;
  isSigned(): Promise<boolean>;
  sign(message: string): Promise<void>;
  getAccount(): Promise<AccountType | null>;
  isDomainNameSupported(chainId: number | null): Promise<boolean>;
  getDomainName(): Promise<string | null | undefined>;
  listenAccountChange(): EventChannel<string[]> | undefined;
  handleAccountChange(): Promise<void>;
  reset(): Promise<void>;
}
