import { BrowserProvider } from 'ethers';

import { SupportedWallets } from './SupportedWallets';

export type InstalledWallets = Record<SupportedWallets, BrowserProvider>;
