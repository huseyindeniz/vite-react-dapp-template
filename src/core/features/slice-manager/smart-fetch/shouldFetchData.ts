import log from 'loglevel';
import { call, select, CallEffect, SelectEffect } from 'redux-saga/effects';

import { getSliceManager } from '../SliceLifecycleManager';
import { getSliceLastAccessed } from '../slice-integration/getSliceLastAccessed';
import { StateSelector } from '../types/StateSelector';
import { areParamsEqual } from '../utils/areParamsEqual';

export function* shouldFetchData<T>(
  sliceName: string,
  dataSelector: StateSelector<T>,
  languageSelector: StateSelector<string | null>,
  requestedLanguage?: string,
  params?: Record<string, unknown>,
  lastFetchParamsSelector?: StateSelector<Record<string, unknown> | undefined>
): Generator<SelectEffect | CallEffect<unknown>, boolean, unknown> {
  // Check if we have current data
  const currentDataRaw: unknown = yield select(dataSelector);
  const currentData = currentDataRaw as T;
  // If no data or empty array, should fetch
  if (
    !currentData ||
    (Array.isArray(currentData) && (currentData as unknown[]).length === 0)
  ) {
    return true;
  }

  // Check if params changed (if params tracking is enabled)
  if (params && lastFetchParamsSelector) {
    const lastFetchParamsRaw: unknown = yield select(lastFetchParamsSelector);
    const lastFetchParams = lastFetchParamsRaw as Record<string, unknown> | undefined;
    if (!areParamsEqual(lastFetchParams, params)) {
      log.debug(
        `🔄 Params changed for ${sliceName}:`,
        { previous: lastFetchParams, current: params }
      );
      return true; // Params changed, fetch fresh data
    }
  }

  // Check if language changed (if language is being used)
  if (requestedLanguage !== undefined) {
    const storedLanguageRaw: unknown = yield select(languageSelector);
    const storedLanguage = storedLanguageRaw as string | null;
    if (storedLanguage !== requestedLanguage) {
      log.debug(
        `🌐 Language changed: ${storedLanguage} -> ${requestedLanguage}`
      );
      return true; // Language changed, fetch fresh data
    }
  }

  // Get slice configuration from SliceManager
  const manager = getSliceManager();
  const sliceConfig: unknown = yield call(
    [manager, 'getSliceConfig'],
    sliceName
  );
  const config = sliceConfig as {
    cleanupStrategy?: string;
    cacheTimeout?: number;
  };

  // If data exists, check cleanupStrategy
  if (!config?.cleanupStrategy) {
    return false; // No config, use existing data
  }

  // Only 'cached' strategy should re-fetch based on timeout
  if (config.cleanupStrategy === 'cached') {
    const cacheTimeout = config.cacheTimeout ?? 300000; // 5 minutes default
    const lastAccessed: unknown = yield call(getSliceLastAccessed, sliceName);
    const age = Date.now() - (lastAccessed as number);
    return age > cacheTimeout;
  }

  // All other strategies (persistent, manual, component, route): use existing data
  return false;
}
