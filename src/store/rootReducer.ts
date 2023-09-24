import { combineReducers } from '@reduxjs/toolkit';

import { walletReducer } from '@/features/wallet/slice';

export default combineReducers({
  wallet: walletReducer,
});
