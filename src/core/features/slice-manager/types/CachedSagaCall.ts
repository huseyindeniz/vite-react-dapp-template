import { CallEffect } from 'redux-saga/effects';

import { ApiCallGenerator } from './ApiCallGenerator';

export type CachedSagaCall<T> = Generator<
  CallEffect<boolean> | CallEffect<void> | CallEffect<ApiCallGenerator<T>>,
  T,
  unknown
>;
