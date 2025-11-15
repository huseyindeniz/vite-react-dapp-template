import { ProtectionType } from '@/config/core/auth/ProtectionType';

import { IProtectionProvider } from '../types/IProtectionProvider';

/**
 * Registry for protection providers
 * Domain features register their protection capabilities here
 */
class ProtectionRegistry {
  private providers = new Map<ProtectionType, IProtectionProvider>();

  /**
   * Register a protection provider
   */
  public register(provider: IProtectionProvider): void {
    this.providers.set(provider.protectionType, provider);
  }

  /**
   * Get a provider by protection type
   */
  public getProvider(type: ProtectionType): IProtectionProvider | undefined {
    return this.providers.get(type);
  }

  /**
   * Get all registered providers
   */
  public getAllProviders(): IProtectionProvider[] {
    return Array.from(this.providers.values());
  }

  /**
   * Check if a provider is registered
   */
  public hasProvider(type: ProtectionType): boolean {
    return this.providers.has(type);
  }
}

// Singleton instance
const registry = new ProtectionRegistry();

/**
 * Register a protection provider
 * Called from composition root (app/config/auth.ts)
 */
export const registerProtectionProvider = (
  provider: IProtectionProvider
): void => {
  registry.register(provider);
};

/**
 * Get a protection provider by type
 */
export const getProtectionProvider = (
  type: ProtectionType
): IProtectionProvider | undefined => {
  return registry.getProvider(type);
};

/**
 * Get all registered protection providers
 */
export const getAllProtectionProviders = (): IProtectionProvider[] => {
  return registry.getAllProviders();
};

/**
 * Check if a protection provider is registered
 */
export const hasProtectionProvider = (type: ProtectionType): boolean => {
  return registry.hasProvider(type);
};
