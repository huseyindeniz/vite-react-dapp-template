import React from 'react';

import { Alert, Badge, Group, Text } from '@mantine/core';
import { IoIosInformationCircle } from 'react-icons/io';

import { useAuth } from '../../hooks/useAuth';
import { AuthState } from '../../models/types/AuthState';

export const AuthStatus: React.FC = () => {
  const auth = useAuth();

  const getStatusColor = () => {
    switch (auth.state) {
      case AuthState.AUTHENTICATED:
        return 'green';
      case AuthState.LOGGING_IN:
      case AuthState.LOGGING_OUT:
      case AuthState.INITIALIZING:
        return 'blue';
      case AuthState.ERROR:
        return 'red';
      case AuthState.READY:
        return 'gray';
      case AuthState.NOT_INITIALIZED:
        return 'gray';
      default:
        return 'gray';
    }
  };

  const getStatusText = () => {
    switch (auth.state) {
      case AuthState.NOT_INITIALIZED:
        return 'Not initialized';
      case AuthState.INITIALIZING:
        return 'Initializing...';
      case AuthState.READY:
        return 'Ready';
      case AuthState.LOGGING_IN:
        return 'Signing in...';
      case AuthState.AUTHENTICATED:
        return `Authenticated via ${auth.currentProvider}`;
      case AuthState.LOGGING_OUT:
        return 'Signing out...';
      case AuthState.ERROR:
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  if (auth.hasError && auth.error) {
    return (
      <Alert
        variant="light"
        color="red"
        icon={<IoIosInformationCircle size={16} />}
        title="Authentication Error"
      >
        {auth.error}
      </Alert>
    );
  }

  return (
    <Group gap="sm" align="center">
      <Badge color={getStatusColor()} variant="light">
        {getStatusText()}
      </Badge>
      
      {auth.isAuthenticated && auth.user && (
        <Group gap="xs">
          <Text size="sm" c="dimmed">
            {auth.user.name} ({auth.user.email})
          </Text>
        </Group>
      )}
      
      {auth.isTokenExpired && (
        <Badge color="orange" variant="light">
          Token expired
        </Badge>
      )}
    </Group>
  );
};