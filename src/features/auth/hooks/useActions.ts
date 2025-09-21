import { bindActionCreators } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import {
  initializeAuth,
  loginWithProvider,
  logout,
} from '../models/actions';

export const useActions = () => {
  const dispatch = useDispatch();

  return bindActionCreators(
    {
      initializeAuth,
      loginWithProvider,
      logout,
    },
    dispatch
  );
};
