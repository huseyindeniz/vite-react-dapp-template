import { combineReducers } from '@reduxjs/toolkit';

import { authReducer } from '@/features/auth/slice';
import { blogDemoReducer } from '@/features/blog-demo/slice';
import { walletReducer } from '@/features/wallet/slice';

export default combineReducers({
  wallet: walletReducer,
  blogDemo: blogDemoReducer,
  auth: authReducer,
});
