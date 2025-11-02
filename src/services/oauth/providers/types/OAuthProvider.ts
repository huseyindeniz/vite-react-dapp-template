// Re-export types from main OAuth types to maintain backwards compatibility
export type { OAuthProviderName } from '@/features/oauth/models/provider/types/OAuthProviderName';
export type { OAuthProviderCredentials } from '@/features/oauth/models/provider/types/OAuthProviderCredentials';
export type { IOAuthProvider as OAuthProvider } from '@/features/oauth/models/provider/interfaces/IOAuthProvider';