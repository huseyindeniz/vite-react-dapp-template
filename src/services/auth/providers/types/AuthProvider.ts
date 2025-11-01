// Re-export types from main auth types to maintain backwards compatibility
export type {
  OAuthProviderName,
  OAuthProviderCredentials,
  IOAuthProvider as AuthProvider,
} from '@/features/oauth/types/IOAuthProvider';