/**
 * Auth Configuration - Composition Root
 *
 * This file defines:
 * 1. ProtectionType enum - all available auth protection types
 * 2. Provider registration - wiring domain features to the auth system
 *
 * To enable/disable auth providers:
 * 1. Add/remove enum value from ProtectionType
 * 2. Add/remove provider registration below
 * 3. Delete/add the provider's feature folder
 *
 * Example: To remove wallet authentication:
 * 1. Delete `WALLET = 'wallet'` from ProtectionType enum
 * 2. Remove `registerProtectionProvider(walletProtectionProvider)` below
 * 3. Delete src/features/wallet/ folder
 *
 * NOTE: Components that need auth checks should import hooks directly from features:
 * - For wallet: import { useWalletAuthentication } from '@/domain/features/wallet/hooks/useWalletAuthentication'
 * - For OAuth: import { useOAuthAuthentication } from '@/domain/features/oauth/hooks/useOAuthAuthentication'
 */

import { registerProtectionProvider } from '@/core/features/auth/registry/protectionRegistry';
import { oauthProtectionProvider } from '@/domain/features/oauth/authProvider';
import { walletProtectionProvider } from '@/domain/features/wallet/authProvider';

// ============================================================================
// Provider Registration
// ============================================================================

// Register wallet protection provider
registerProtectionProvider(walletProtectionProvider);

// Register OAuth protection provider
registerProtectionProvider(oauthProtectionProvider);
