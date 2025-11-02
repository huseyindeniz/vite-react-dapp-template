import { JSX } from 'react';

import { ProtectionType } from '@/features/app/config/auth/ProtectionType';

import { getProtectionProvider } from '../registry/protectionRegistry';

/**
 * Apply protection to a route element based on protection type
 * Delegates to registered providers
 */
export const applyProtection = (
  element: JSX.Element,
  protectionType?: ProtectionType
): JSX.Element => {
  switch (protectionType) {
    case ProtectionType.WALLET: {
      const provider = getProtectionProvider(ProtectionType.WALLET);
      return provider ? provider.withProtection(element) : element;
    }
    case ProtectionType.AUTH: {
      const provider = getProtectionProvider(ProtectionType.AUTH);
      return provider ? provider.withProtection(element) : element;
    }
    case ProtectionType.BOTH: {
      const authProvider = getProtectionProvider(ProtectionType.AUTH);
      const walletProvider = getProtectionProvider(ProtectionType.WALLET);

      let protectedElement = element;

      if (walletProvider) {
        protectedElement = walletProvider.withProtection(protectedElement);
      }

      if (authProvider) {
        protectedElement = authProvider.withProtection(protectedElement);
      }

      return protectedElement;
    }
    case ProtectionType.NONE:
    default:
      return element;
  }
};
