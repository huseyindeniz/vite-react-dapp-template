import { AccountType } from './Account';
import { AccountLoadState } from './AccountLoadState';
import { AccountSignState } from './AccountSignState';

export type AccountStoreState = {
  accountLoadState: AccountLoadState;
  accountSignState: AccountSignState;
  signCounter: number;
  account: AccountType | null;
};
