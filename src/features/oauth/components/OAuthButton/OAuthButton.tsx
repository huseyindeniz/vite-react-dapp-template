import React from 'react';

import { Avatar, Button, Menu, Group, Text } from '@mantine/core';
import log from 'loglevel';
import { useTranslation } from 'react-i18next';
import { FaChevronDown, FaUser } from 'react-icons/fa';
import { IoIosLogOut } from 'react-icons/io';
import { Link } from 'react-router-dom';

import { usePageLink } from '@/features/router/hooks/usePageLink';

import { SUPPORTED_OAUTH_PROVIDERS } from '../../config';
import { useOAuth } from '../../hooks/useOAuth';
import { useOAuthActions } from '../../hooks/useOAuthActions';
import { OAuthProviderName } from '../../models/provider/types/OAuthProviderName';
import { OAuthState } from '../../models/session/types/OAuthState';

interface OAuthButtonProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'filled' | 'light' | 'outline' | 'subtle';
  fullWidth?: boolean;
}

export const OAuthButton: React.FC<OAuthButtonProps> = ({
  size = 'sm',
  variant = 'outline',
  fullWidth = false,
}) => {
  const { t } = useTranslation('feature-oauth');
  const { pageLink } = usePageLink();
  const { state, user, currentProvider, isLoading } = useOAuth();
  const { loginWith, logout } = useOAuthActions();

  const handleProviderLogin = (providerName: string) => {
    log.debug(`Starting login with provider: ${providerName}`);
    // Use the Redux saga flow which handles the entire process through AuthService
    loginWith(providerName as OAuthProviderName);
  };

  // Loading state
  if (state === OAuthState.LOGGING_IN) {
    return (
      <Button size={size} variant={variant} fullWidth={fullWidth} loading>
        {t('Signing in...')}
      </Button>
    );
  }

  // Logging out state
  if (state === OAuthState.LOGGING_OUT) {
    return (
      <Button size={size} variant={variant} fullWidth={fullWidth} loading>
        {t('Signing out...')}
      </Button>
    );
  }

  // Authenticated state
  if (state === OAuthState.AUTHENTICATED && user) {
    return (
      <Menu shadow="md" width="auto">
        <Menu.Target>
          <Button
            size={size}
            variant={variant}
            fullWidth={fullWidth}
            rightSection={<FaChevronDown size={16} />}
            leftSection={
              user.avatarUrl ? (
                <Avatar src={user.avatarUrl} size={20} radius="xl" />
              ) : (
                <FaUser size={16} />
              )
            }
          >
            {user.given_name || user.name || user.email}
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>
            <Group gap="sm">
              {user.avatarUrl && (
                <Avatar src={user.avatarUrl} size={24} radius="xl" />
              )}
              <div>
                <Text size="sm" fw={500}>
                  {user.given_name || user.name}
                </Text>
                <Text size="xs" c="dimmed">
                  {t('Signed in with')} {currentProvider}
                </Text>
              </div>
            </Group>
          </Menu.Label>
          <Menu.Item>{user.email}</Menu.Item>
          <Menu.Divider />
          <Menu.Item
            leftSection={<FaUser size={16} />}
            component={Link}
            to={pageLink('/oauth-profile')}
          >
            {t('My Profile')}
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item leftSection={<IoIosLogOut size={14} />} onClick={logout}>
            {t('Sign out')}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  }

  // Not authenticated - show provider options
  if (SUPPORTED_OAUTH_PROVIDERS.length <= 1) {
    const provider = SUPPORTED_OAUTH_PROVIDERS[0];
    return (
      <Button
        size={size}
        variant={variant}
        fullWidth={fullWidth}
        leftSection={
          provider.icon ? (
            <img
              src={provider.icon}
              alt={provider.label}
              width={16}
              height={16}
            />
          ) : null
        }
        onClick={() => handleProviderLogin(provider.name)}
        disabled={isLoading || state !== OAuthState.READY}
      >
        {t('Sign in with')} {provider.label}
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
          disabled={isLoading || state !== OAuthState.READY}
        >
          {t('Sign in')}
        </Button>
      </Menu.Target>

      <Menu.Dropdown style={{ minWidth: 250 }}>
        <Menu.Label>{t('Choose auth provider')}</Menu.Label>
        {SUPPORTED_OAUTH_PROVIDERS.map(provider => (
          <Menu.Item
            key={provider.name}
            leftSection={
              provider.icon ? (
                <img
                  src={provider.icon}
                  alt={provider.label}
                  width={16}
                  height={16}
                />
              ) : null
            }
            onClick={() => handleProviderLogin(provider.name)}
          >
            {t('Sign in with')} {provider.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};
