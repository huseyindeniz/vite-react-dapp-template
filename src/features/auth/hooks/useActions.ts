import { bindActionCreators } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import {
  initializeAuth,
  loginWithProvider,
  loginWithCredentials,
  logout,
  refreshToken,
  restoreSession,
} from '../models/actions';

export const useActions = () => {
  const dispatch = useDispatch();

  return bindActionCreators(
    {
      initializeAuth,
      loginWithProvider,
      loginWithCredentials,
      logout,
      refreshToken,
      restoreSession,
    },
    dispatch
  );
};
