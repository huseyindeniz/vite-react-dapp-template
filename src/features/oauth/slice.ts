import { combineReducers } from '@reduxjs/toolkit';

import { sessionReducer } from './models/session/slice';

export const oauthReducer = combineReducers({
  session: sessionReducer,
});