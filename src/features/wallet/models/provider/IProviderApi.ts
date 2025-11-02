import { InstalledWallets } from './types/InstalledWallets';
import { SupportedWallets } from './types/SupportedWallets';

export interface IProviderApi {
  detectWallets: () => Promise<InstalledWallets>;
  loadProvider: (wallet: SupportedWallets) => Promise<boolean>;
}
