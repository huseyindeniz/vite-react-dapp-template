import {
  combineReducers,
  configureStore,
  type Reducer,
} from '@reduxjs/toolkit';
import { enableMapSet } from 'immer';
import saga, { type Saga } from 'redux-saga';
import { all, fork } from 'redux-saga/effects';

import { features } from '../config/features';

enableMapSet();

/**
 * Build reducers object dynamically from features config
 */
const buildReducers = () => {
  const reducers: Record<string, Reducer> = {};

  for (const [, feature] of Object.entries(features)) {
    if (feature.enabled) {
      reducers[feature.store.stateKey] = feature.store.reducer;
    }
  }

  return reducers;
};

const rootReducer = combineReducers(buildReducers());

/**
 * Build root saga dynamically from features config
 */
function* rootSaga() {
  const sagas = [];

  for (const [, feature] of Object.entries(features)) {
    if (feature.enabled) {
      const { saga: sagaFn, dependencies } = feature.saga;
      // Cast to Saga type to satisfy TypeScript when iterating dynamically
      const typedSaga = sagaFn as Saga;

      if (dependencies && dependencies.length > 0) {
        sagas.push(fork(typedSaga, ...dependencies));
      } else {
        sagas.push(fork(typedSaga));
      }
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
