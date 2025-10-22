import { combineReducers } from '@reduxjs/toolkit';

import { sessionReducer } from './models/session/slice';

export const authReducer = combineReducers({
  session: sessionReducer,
});