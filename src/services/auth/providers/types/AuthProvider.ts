// Re-export types from main auth types to maintain backwards compatibility
export type {
  AuthProviderName,
  AuthProviderCredentials,
  IAuthProvider as AuthProvider,
} from '@/features/auth/types/IAuthProvider';