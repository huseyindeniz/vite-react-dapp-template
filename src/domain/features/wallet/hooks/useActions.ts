import { bindActionCreators } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import {
  disconnectWallet,
  signIn,
  unlockWallet,
} from '../models/account/actions';
import { latestBlock, switchNetwork } from '../models/network/actions';
import { connectWallet, selectWallet } from '../models/provider/actions';

export const useActions = () => {
  const dispatch = useDispatch();

  return bindActionCreators(
    {
      connectWallet,
      selectWallet,
      switchNetwork,
      unlockWallet,
      signIn,
      disconnectWallet,
      latestBlock,
    },
    dispatch
  );
};
