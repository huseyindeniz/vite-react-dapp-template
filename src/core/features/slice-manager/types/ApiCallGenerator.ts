import { CallEffect } from 'redux-saga/effects';

export type ApiCallGenerator<T> = Generator<CallEffect<T>, T, unknown>;
