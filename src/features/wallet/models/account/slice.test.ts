import { disconnectWallet } from './actions';
import * as slicesActions from './slice';
import { AccountType } from './types/Account';
import { AccountLoadState } from './types/AccountLoadState';
import { AccountSignState } from './types/AccountSignState';

const mockObject = <T extends object>(): T => {
  return {} as T;
};

describe('wallet:account slice', () => {
  it('should set wallet account load state', () => {
    const state = slicesActions.initialState;
    const action = slicesActions.setAccountLoadState(
      AccountLoadState.ACCOUNT_LOADED
    );
    const nextState = slicesActions.accountReducer(state, action);
    expect(nextState.accountLoadState).toEqual(AccountLoadState.ACCOUNT_LOADED);
  });

  it('should set wallet sign state', () => {
    const state = slicesActions.initialState;
    const action = slicesActions.setAccountSignState(
      AccountSignState.NOT_SIGNED
    );
    const nextState = slicesActions.accountReducer(state, action);
    expect(nextState.accountSignState).toEqual(AccountSignState.NOT_SIGNED);
  });

  it('should decrease signCounter 1 at a time', () => {
    const state = slicesActions.initialState;
    const currentCounter = state.signCounter;
    const action = slicesActions.decSignCounter();
    const nextState = slicesActions.accountReducer(state, action);
    expect(nextState.signCounter).toEqual(currentCounter - 1);
  });

  it("should not change signCounter if it's already 0", () => {
    const state = { ...slicesActions.initialState, signCounter: 0 };
    const action = slicesActions.decSignCounter();
    const nextState = slicesActions.accountReducer(state, action);
    expect(nextState.signCounter).toEqual(0);
  });

  it('should set signCounter to initial state', () => {
    const state = {
      ...slicesActions.initialState,
      signCounter: slicesActions.initialState.signCounter - 1,
    };
    const action = slicesActions.resetSignCounter();
    const nextState = slicesActions.accountReducer(state, action);
    expect(nextState.signCounter).toEqual(
      slicesActions.initialState.signCounter
    );
  });

  it('should set account', () => {
    const state = slicesActions.initialState;
    const mockAccount: AccountType = mockObject<AccountType>();
    mockAccount.address = 'My Mock Accound Address';
    const action = slicesActions.setAccount(mockAccount);
    const nextState = slicesActions.accountReducer(state, action);
    expect(nextState.account).toEqual(mockAccount);
  });

  it('should reset the state when the disconnectWallet action is dispatched', () => {
    const state = slicesActions.initialState;
    const action = slicesActions.setAccountLoadState(
      AccountLoadState.ACCOUNT_LOADED
    );
    let nextState = slicesActions.accountReducer(state, action);
    nextState = slicesActions.accountReducer(nextState, disconnectWallet());
    expect(nextState).toEqual(state);
  });
});
