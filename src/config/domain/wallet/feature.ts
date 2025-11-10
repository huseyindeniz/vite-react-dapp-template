import { defineFeature } from '@/core/features/app/types/FeatureConfig';
import { watchWalletSaga } from '@/domain/features/wallet/sagas';
import { walletReducer } from '@/domain/features/wallet/slice';

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
