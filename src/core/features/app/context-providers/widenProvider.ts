import { Provider } from './types/Provider';
import { ProviderEntry } from './types/ProviderEntry';

export function widenProvider<TProps>(provider: Provider<TProps>): ProviderEntry {
  return provider as unknown as ProviderEntry;
}
