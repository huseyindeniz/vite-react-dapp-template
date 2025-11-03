import { JSX } from 'react';

import { ProtectionType } from '@/features/app/config/auth/ProtectionType';

import {
  getProtectionProvider,
  getAllProtectionProviders,
} from '../registry/protectionRegistry';

/**
 * Apply protection to a route element based on protection type
 * Delegates to registered providers - data-driven approach
 * No hard-coded switch cases needed!
 */
export const applyProtection = (
  element: JSX.Element,
  protectionType?: ProtectionType
): JSX.Element => {
  // No protection needed
  if (!protectionType || protectionType === ProtectionType.NONE) {
    return element;
  }

  // BOTH means apply ALL registered providers (except NONE)
  if (protectionType === ProtectionType.BOTH) {
    let protectedElement = element;
    const allProviders = getAllProtectionProviders();

    // Apply each registered provider in sequence
    for (const provider of allProviders) {
      if (provider.protectionType !== ProtectionType.NONE) {
        protectedElement = provider.withProtection(protectedElement);
      }
    }

    return protectedElement;
  }

  // Single protection type - dynamic lookup from registry
  const provider = getProtectionProvider(protectionType);
  return provider ? provider.withProtection(element) : element;
};
