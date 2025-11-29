import { useEffect } from 'react';

import { Center, Loader, Text, Stack } from '@mantine/core';
import log from 'loglevel';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const GithubCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      log.debug('GitHub OAuth callback received:', {
        code: !!code,
        state: !!state,
        error,
      });

      // Check if this is a popup or regular window
      if (window.opener && window.opener !== window) {
        // We're in a popup - send message to parent window
        window.opener.postMessage(
          {
            type: 'github-oauth-callback',
            code,
            state,
            error: error || errorDescription,
          },
          window.location.origin
        );

        // Show success message briefly then close
        setTimeout(() => {
          window.close();
        }, 1000);
        // Important: exit here to prevent further navigation
      } else if (error) {
        // We're in the main window and there's an error
        log.error('GitHub OAuth error:', error, errorDescription);
        navigate('/auth/error', {
          state: {
            error: 'GitHub login failed',
            description: errorDescription || error,
          },
        });
      } else if (code && state) {
        // We're in the main window with success
        // In a real implementation, you would trigger the auth action here
        // For now, we'll redirect to home with a message
        log.info('GitHub OAuth successful, code received');
        navigate('/', {
          state: {
            authCode: code,
            authState: state,
            provider: 'github',
          },
        });
      } else {
        // We're in the main window with invalid callback
        navigate('/auth/error', {
          state: {
            error: 'Invalid callback',
            description: 'Missing required parameters',
          },
        });
      }
    };

    handleCallback();
  }, [searchParams]);

  return (
    <Center h="100vh">
      <Stack align="center" gap="md">
        <Loader size="lg" />
        <Text size="lg" fw={500}>
          Completing GitHub login...
        </Text>
        <Text size="sm" c="dimmed">
          {window.opener ? 'You can close this window' : 'Redirecting...'}
        </Text>
      </Stack>
    </Center>
  );
};
