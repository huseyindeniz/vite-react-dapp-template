import React, { useEffect } from 'react';

import { Button, Menu } from '@mantine/core';
import { FaChevronDown, FaUser } from 'react-icons/fa';
import { IoIosLogOut } from 'react-icons/io';

import { SUPPORTED_AUTH_PROVIDERS } from '../../config';
import { useAuth } from '../../hooks/useAuth';
import { useAuthActions } from '../../hooks/useAuthActions';

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
  const { loginWith, logout, initialize } = useAuthActions();

  // Initialize auth when component mounts
  useEffect(() => {
    if (!auth.isInitialized) {
      initialize();
    }
  }, [auth.isInitialized, initialize]);

  // Loading state
  if (auth.isLoggingIn) {
    return (
      <Button 
        size={size} 
        variant={variant} 
        fullWidth={fullWidth}
        loading
      >
        Signing in...
      </Button>
    );
  }

  // Logging out state
  if (auth.isLoggingOut) {
    return (
      <Button 
        size={size} 
        variant={variant} 
        fullWidth={fullWidth}
        loading
      >
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
          <Menu.Item
            leftSection={<IoIosLogOut size={14} />}
            onClick={logout}
          >
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
        onClick={() => loginWith(provider.name)}
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
        {SUPPORTED_AUTH_PROVIDERS.map((provider) => (
          <Menu.Item
            key={provider.name}
            onClick={() => loginWith(provider.name)}
          >
            Sign in with {provider.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};