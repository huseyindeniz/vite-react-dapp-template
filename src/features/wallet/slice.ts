import { combineReducers } from '@reduxjs/toolkit';

import { accountReducer } from './models/account/slice';
import { networkReducer } from './models/network/slice';
import { providerReducer } from './models/provider/slice';
import { walletStateReducer } from './models/slice';

export const walletReducer = combineReducers({
  state: walletStateReducer,
  provider: providerReducer,
  network: networkReducer,
  account: accountReducer,
});
