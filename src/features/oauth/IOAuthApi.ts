import { IOAuthProvider } from './models/provider/IOAuthProvider';
import { OAuthProviderCredentials } from './models/provider/types/OAuthProviderCredentials';
import { OAuthProviderName } from './models/provider/types/OAuthProviderName';
import { ISessionApi } from './models/session/ISessionApi';
import { OAuthUser } from './models/session/types/OAuthUser';

export interface IOAuthApi extends ISessionApi {
  // Provider management methods
  registerProvider: (provider: IOAuthProvider) => void;
  getProvider: (name: OAuthProviderName) => IOAuthProvider;
  getSupportedProviders: () => IOAuthProvider[];
  hasProvider: (name: OAuthProviderName) => boolean;
  initializeProviders: () => Promise<void>;
  initializeProvider: (name: OAuthProviderName) => Promise<void>;
  isProviderAvailable: (name: OAuthProviderName) => boolean;
  getAvailableProviders: () => IOAuthProvider[];

  // High-level auth operations
  getProviderCredentials: (
    providerName: OAuthProviderName
  ) => Promise<OAuthProviderCredentials>;
  exchangeTokenWithBackend: (
    providerName: OAuthProviderName,
    credentials: OAuthProviderCredentials
  ) => Promise<{ user: OAuthUser }>;
  loginWithProvider: (
    providerName: OAuthProviderName
  ) => Promise<{ user: OAuthUser }>;
  logout: (providerName?: OAuthProviderName) => Promise<void>;
}
