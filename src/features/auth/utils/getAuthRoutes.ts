import { getAllProtectionProviders } from '../registry/protectionRegistry';

/**
 * Get all auth-specific routes from registered providers
 * (e.g., OAuth callback routes)
 */
export const getAuthRoutes = () => {
  const providers = getAllProtectionProviders();
  const routes: unknown[] = [];

  providers.forEach(provider => {
    if (provider.getAuthRoutes) {
      routes.push(...provider.getAuthRoutes());
    }
  });

  return routes;
};
