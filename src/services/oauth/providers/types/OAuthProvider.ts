// Re-export types from main OAuth types to maintain backwards compatibility
export type {
  OAuthProviderName,
  OAuthProviderCredentials,
  IOAuthProvider as OAuthProvider,
} from '@/features/oauth/types/IOAuthProvider';