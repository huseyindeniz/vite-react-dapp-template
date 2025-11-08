import {
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit';
import { enableMapSet } from 'immer';
import saga, { type Saga } from 'redux-saga';
import { all, fork } from 'redux-saga/effects';

import { features } from '@/config/features';

enableMapSet();

/**
 * Type helper to extract reducer map from features config
 * Preserves specific reducer types for proper RootState inference
 */
type FeatureReducers = {
  [K in keyof typeof features]: (typeof features)[K]['store']['reducer'];
};

/**
 * Build reducers object dynamically from features config
 * Returns properly typed object to preserve RootState type inference
 */
const buildReducers = (): FeatureReducers => {
  return Object.fromEntries(
    Object.entries(features).map(([key, feature]) => [key, feature.store.reducer])
  ) as FeatureReducers;
};

const rootReducer = combineReducers(buildReducers());

/**
 * Build root saga dynamically from features config
 */
function* rootSaga() {
  const sagas = [];

  for (const [, feature] of Object.entries(features)) {
    const { saga: sagaFn, dependencies } = feature.saga;
    // Cast to Saga type to satisfy TypeScript when iterating dynamically
    const typedSaga = sagaFn as Saga;

    if (dependencies && dependencies.length > 0) {
      sagas.push(fork(typedSaga, ...dependencies));
    } else {
      sagas.push(fork(typedSaga));
    }
  }

  yield all(sagas);
}

const sagaMiddleware = saga();

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(sagaMiddleware),
  devTools: import.meta.env.MODE === 'development',
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
