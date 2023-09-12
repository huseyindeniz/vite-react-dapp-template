import { disconnectWallet } from "../account/actions";
import { LoadingStatusType } from "../types/LoadingStatus";

import * as slicesActions from "./slice";
import { BlockInfo } from "./types/BlockInfo";
import { Network } from "./types/Network";
import { NetworkLoadState } from "./types/NetworkLoadState";

const mockObject = <T extends object>(): T => {
  return {} as T;
};

describe("wallet:network slice", () => {
  it("should set wallet network load state", () => {
    const state = slicesActions.initialState;
    const action = slicesActions.setNetworkLoadState(
      NetworkLoadState.NETWORK_DETECTION_FAILED
    );
    const nextState = slicesActions.networkReducer(state, action);
    expect(nextState.networkLoadState).toEqual(
      NetworkLoadState.NETWORK_DETECTION_FAILED
    );
  });

  it("should set current network", () => {
    const state = slicesActions.initialState;
    const mockNetwork: Network = mockObject<Network>();
    mockNetwork.chainName = "My Mock Network";
    const action = slicesActions.setNetwork(mockNetwork);
    const nextState = slicesActions.networkReducer(state, action);
    expect(nextState.network).toEqual(mockNetwork);
  });

  it("should set block info loading", () => {
    const state = slicesActions.initialState;
    const action = slicesActions.setBlockInfoLoading(LoadingStatusType.PENDING);
    const nextState = slicesActions.networkReducer(state, action);
    expect(nextState.blockInfoLoading).toEqual(LoadingStatusType.PENDING);
  });

  it("should set block info", () => {
    const state = slicesActions.initialState;
    const mockBlockInfo: BlockInfo = mockObject<BlockInfo>();
    mockBlockInfo.blockNumber = "1";
    mockBlockInfo.signerAccountBalance = "Mock balance";
    const action = slicesActions.setBlockInfo(mockBlockInfo);
    const nextState = slicesActions.networkReducer(state, action);
    expect(nextState.blockInfo).toEqual(mockBlockInfo);
  });

  it("should reset the state when the disconnectWallet action is dispatched", () => {
    const state = slicesActions.initialState;
    const action = slicesActions.setBlockInfoLoading(LoadingStatusType.PENDING);
    let nextState = slicesActions.networkReducer(state, action);
    nextState = slicesActions.networkReducer(nextState, disconnectWallet());
    expect(nextState).toEqual(state);
  });
});
