import { createAction } from '@reduxjs/toolkit';

export const loadNetwork = createAction<number>('LOAD_NETWORK');
export const switchNetwork = createAction<number>('SWITCH_NETWORK');
export const latestBlock = createAction('LATEST_BLOCK');
