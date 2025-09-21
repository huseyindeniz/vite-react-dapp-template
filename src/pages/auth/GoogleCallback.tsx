import { useEffect } from 'react';

import { Center, Loader, Text, Stack } from '@mantine/core';
import log from 'loglevel';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      log.debug('Google OAuth callback received:', { code: !!code, state: !!state, error });

      if (error) {
        log.error('Google OAuth error:', error, errorDescription);
        navigate('/auth/error', {
          state: {
            error: 'Google login failed',
            description: errorDescription || error
          }
        });
        return;
      }

      if (!code || !state) {
        navigate('/auth/error', {
          state: {
            error: 'Invalid callback',
            description: 'Missing required parameters'
          }
        });
        return;
      }

      // Check if this is a popup or regular window
      if (window.opener && window.opener !== window) {
        // We're in a popup - send message to parent window
        window.opener.postMessage(
          {
            type: 'google-oauth-callback',
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
      } else if (error) {
        // We're in the main window and there's an error
        log.error('Google OAuth error:', error, errorDescription);
        navigate('/auth/error', {
          state: {
            error: 'Google login failed',
            description: errorDescription || error
          }
        });
      } else if (code && state) {
        // We're in the main window with success (fallback)
        log.info('Google OAuth successful, code received');
        navigate('/', {
          state: {
            authCode: code,
            authState: state,
            provider: 'google'
          }
        });
      } else {
        // We're in the main window with invalid callback
        navigate('/auth/error', {
          state: {
            error: 'Invalid callback',
            description: 'Missing required parameters'
          }
        });
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <Center h="100vh">
      <Stack align="center" gap="md">
        <Loader size="lg" />
        <Text size="lg" fw={500}>
          Completing Google login...
        </Text>
        <Text size="sm" c="dimmed">
          Redirecting...
        </Text>
      </Stack>
    </Center>
  );
};