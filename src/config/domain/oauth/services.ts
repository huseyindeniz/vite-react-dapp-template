import { OAuthService } from '@/services/oauth/OAuthService';
import { GitHubOAuthProvider } from '@/services/oauth/providers/github/GitHubOAuthProvider';
import { GoogleOAuthProvider } from '@/services/oauth/providers/google/GoogleOAuthProvider';

export const oauthService = OAuthService.getInstance();

// Register OAuth providers
oauthService.registerProvider(new GoogleOAuthProvider());
oauthService.registerProvider(new GitHubOAuthProvider());
