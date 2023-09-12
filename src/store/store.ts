import { configureStore } from "@reduxjs/toolkit";
import { enableMapSet } from "immer";
import saga from "redux-saga";
import { all, fork } from "redux-saga/effects";

import {
  watchWalletSaga /*announceWalletLoaded*/,
} from "../features/wallet/sagas";
import { EthersWalletAPI } from "../services/Ethers/WalletAPI/EthersWalletAPI";

import RootReducer from "./rootReducer";

enableMapSet();

const walletApi = EthersWalletAPI.getInstance();

function* RootSaga() {
  yield all([fork(watchWalletSaga, walletApi)]);
}

const sagaMiddleware = saga();

const store = configureStore({
  reducer: RootReducer,
  middleware: [sagaMiddleware],
  devTools: import.meta.env.MODE === "development",
});

sagaMiddleware.run(RootSaga);

export type RootState = ReturnType<typeof store.getState>;

export default store;
