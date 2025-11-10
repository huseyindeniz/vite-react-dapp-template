// Re-export types from main OAuth types to maintain backwards compatibility
export type { OAuthProviderName } from '@/domain/features/oauth/models/provider/types/OAuthProviderName';
export type { OAuthProviderCredentials } from '@/domain/features/oauth/models/provider/types/OAuthProviderCredentials';
export type { IOAuthProvider as OAuthProvider } from '@/domain/features/oauth/models/provider/interfaces/IOAuthProvider';