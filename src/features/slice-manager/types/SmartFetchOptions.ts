import { StateSelector } from '../lib/types/StateSelector';

export interface SmartFetchOptions {
  maxAge?: number;
  forceRefresh?: boolean;
  ttl?: number;
  languageSelector?: StateSelector<string | null>;
  lastFetchParamsSelector?: StateSelector<Record<string, unknown> | undefined>;
}
