import { bindActionCreators } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import {
  loginWithProvider,
  logout,
} from '../models/session/actions';

export const useActions = () => {
  const dispatch = useDispatch();

  return bindActionCreators(
    {
      loginWithProvider,
      logout,
    },
    dispatch
  );
};
