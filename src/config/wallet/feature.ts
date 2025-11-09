import { defineFeature } from '@/features/app/types/FeatureConfig';
import { watchWalletSaga } from '@/features/wallet/sagas';
import { walletReducer } from '@/features/wallet/slice';

import { walletApi } from './services';

export const walletFeatureConfig = defineFeature({
  id: 'feature-wallet',
  store: {
    stateKey: 'wallet',
    reducer: walletReducer,
  },
  saga: {
    saga: watchWalletSaga,
    dependencies: [walletApi],
  },
});
