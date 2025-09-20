export const getGoogleClientId = (): string => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error(
      'Google Client ID is not configured. Please set VITE_GOOGLE_CLIENT_ID environment variable.'
    );
  }
  return clientId;
};

export const getGoogleScope = (): string => {
  return import.meta.env.VITE_GOOGLE_SCOPE || 'openid email profile';
};