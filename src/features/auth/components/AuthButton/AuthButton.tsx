import React from 'react';

import { Button, Menu } from '@mantine/core';
import log from 'loglevel';
import { FaChevronDown, FaUser } from 'react-icons/fa';
import { IoIosLogOut } from 'react-icons/io';

import { SUPPORTED_AUTH_PROVIDERS, getAuthProviderByName } from '../../config';
import { useAuth } from '../../hooks/useAuth';
import { useAuthActions } from '../../hooks/useAuthActions';
import { AuthProviderName } from '../../providers/types/AuthProvider';

interface AuthButtonProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'filled' | 'light' | 'outline' | 'subtle';
  fullWidth?: boolean;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  size = 'sm',
  variant = 'outline',
  fullWidth = false,
}) => {
  const auth = useAuth();
  const { loginWithCredentials, logout } = useAuthActions();

  const handleProviderLogin = async (providerName: string) => {
    try {
      log.debug(`Starting login with provider: ${providerName}`);
      // Get provider and initialize it first
      const provider = getAuthProviderByName(providerName as AuthProviderName);
      if (!provider) {
        throw new Error(`${providerName} provider not found`);
      }

      // Initialize provider before checking availability
      await provider.initialize();

      if (!provider.isAvailable()) {
        throw new Error(`${providerName} provider not available`);
      }

      // Call provider login synchronously - no Redux delay
      const credentials = await provider.login();

      // Pass credentials directly to Redux without delay
      loginWithCredentials(providerName as AuthProviderName, credentials);
    } catch (error) {
      log.debug('Provider login failed:', error);
      // Could show error state here
    }
  };

  // Loading state
  if (auth.isLoggingIn) {
    return (
      <Button size={size} variant={variant} fullWidth={fullWidth} loading>
        Signing in...
      </Button>
    );
  }

  // Logging out state
  if (auth.isLoggingOut) {
    return (
      <Button size={size} variant={variant} fullWidth={fullWidth} loading>
        Signing out...
      </Button>
    );
  }

  // Authenticated state
  if (auth.isAuthenticated && auth.user) {
    return (
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Button
            size={size}
            variant={variant}
            fullWidth={fullWidth}
            rightSection={<FaChevronDown size={16} />}
            leftSection={<FaUser size={16} />}
          >
            {auth.user.name}
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Signed in with {auth.currentProvider}</Menu.Label>
          <Menu.Item>{auth.user.email}</Menu.Item>
          <Menu.Divider />
          <Menu.Item leftSection={<IoIosLogOut size={14} />} onClick={logout}>
            Sign out
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  }

  // Not authenticated - show provider options
  if (SUPPORTED_AUTH_PROVIDERS.length === 1) {
    const provider = SUPPORTED_AUTH_PROVIDERS[0];
    return (
      <Button
        size={size}
        variant={variant}
        fullWidth={fullWidth}
        onClick={() => handleProviderLogin(provider.name)}
        disabled={auth.isLoading || !auth.isReady}
      >
        Sign in with {provider.label}
      </Button>
    );
  }

  // Multiple providers - show menu
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button
          size={size}
          variant={variant}
          fullWidth={fullWidth}
          rightSection={<FaChevronDown size={16} />}
          disabled={auth.isLoading || !auth.isReady}
        >
          Sign in
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Choose auth provider</Menu.Label>
        {SUPPORTED_AUTH_PROVIDERS.map(provider => (
          <Menu.Item
            key={provider.name}
            onClick={() => handleProviderLogin(provider.name)}
          >
            Sign in with {provider.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};
