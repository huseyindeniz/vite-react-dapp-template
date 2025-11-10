import { ProtectionType } from '@/config/core/auth/ProtectionType';
import { IProtectionProvider } from '@/core/features/auth/types/IProtectionProvider';

import { withWalletProtection } from './hocs/withWalletProtection';
import { usePostLoginRedirect } from './hooks/usePostLoginRedirect';
import { useWalletAuthentication } from './hooks/useWalletAuthentication';

/**
 * Wallet protection provider
 * Implements IProtectionProvider to integrate wallet authentication with auth system
 */
export const walletProtectionProvider: IProtectionProvider = {
  protectionType: ProtectionType.WALLET,
  withProtection: withWalletProtection,
  useAuthentication: useWalletAuthentication,
  usePostLoginRedirect,
};
