import { ProtectionType } from '@/features/app/config/auth/ProtectionType';
import { IProtectionProvider } from '@/features/auth/types/IProtectionProvider';

import { withOAuthProtection } from './hocs/withOAuthProtection';
import { getOAuthRoutes } from './routes';

/**
 * OAuth protection provider
 * Implements IProtectionProvider to integrate OAuth authentication with auth system
 */
export const oauthProtectionProvider: IProtectionProvider = {
  protectionType: ProtectionType.AUTH,
  withProtection: withOAuthProtection,
  getAuthRoutes: getOAuthRoutes,
};
