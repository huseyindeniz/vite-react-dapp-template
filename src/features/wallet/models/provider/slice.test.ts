import { disconnectWallet } from '../account/actions';

import * as slicesActions from './slice';
import { ProviderLoadState } from './types/ProviderLoadState';

describe('wallet:provider slice', () => {
  it('should set wallet init state', () => {
    const state = slicesActions.initialState;
    const action = slicesActions.setProviderLoadState(
      ProviderLoadState.INITIALIZED
    );
    const nextState = slicesActions.providerReducer(state, action);
    expect(nextState.providerLoadState).toEqual(ProviderLoadState.INITIALIZED);
  });

  it('should reset the state when the disconnectWallet action is dispatched', () => {
    const state = slicesActions.initialState;
    const action = slicesActions.setProviderLoadState(
      ProviderLoadState.INITIALIZED
    );
    let nextState = slicesActions.providerReducer(state, action);
    nextState = slicesActions.providerReducer(nextState, disconnectWallet());
    expect(nextState).toEqual(state);
  });
});
