import { CallEffect, SelectEffect } from 'redux-saga/effects';

export type SmartFetchSaga<T> = Generator<
  CallEffect<boolean> | SelectEffect | CallEffect<T>,
  T | null,
  unknown
>;
