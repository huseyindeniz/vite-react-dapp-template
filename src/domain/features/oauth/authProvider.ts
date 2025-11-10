import { ProtectionType } from '@/config/core/auth/ProtectionType';
import { IProtectionProvider } from '@/core/features/auth/types/IProtectionProvider';

import { withOAuthProtection } from './hocs/withOAuthProtection';
import { getOAuthRoutes } from './routes';

/**
 * OAuth protection provider
 * Implements IProtectionProvider to integrate OAuth authentication with auth system
 */
export const oauthProtectionProvider: IProtectionProvider = {
  protectionType: ProtectionType.OAUTH,
  withProtection: withOAuthProtection,
  getAuthRoutes: getOAuthRoutes,
};
