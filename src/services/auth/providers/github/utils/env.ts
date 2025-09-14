export const getGitHubClientId = (): string => {
  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
  if (!clientId) {
    throw new Error(
      'GitHub Client ID is not configured. Please set VITE_GITHUB_CLIENT_ID environment variable.'
    );
  }
  return clientId;
};

export const getGitHubRedirectUri = (): string => {
  return import.meta.env.VITE_GITHUB_REDIRECT_URI || `${window.location.origin}/auth/callback/github`;
};

export const getGitHubScope = (): string => {
  return import.meta.env.VITE_GITHUB_SCOPE || 'user:email';
};