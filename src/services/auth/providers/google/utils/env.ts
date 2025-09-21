export const getGoogleClientId = (): string => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error(
      'Google Client ID is not configured. Please set VITE_GOOGLE_CLIENT_ID environment variable.'
    );
  }
  return clientId;
};

export const getGoogleRedirectUri = (): string => {
  return import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/callback/google`;
};

export const getGoogleScope = (): string => {
  return import.meta.env.VITE_GOOGLE_SCOPE || 'openid email profile';
};