import { useEffect } from 'react';

import { Center, Loader, Text, Stack } from '@mantine/core';
import log from 'loglevel';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      // For hybrid flow (code id_token), check both query params and URL fragment
      let code = searchParams.get('code');
      let state = searchParams.get('state');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      // Extract both code and id_token from URL fragment (for hybrid flow)
      const fragment = window.location.hash.substring(1);
      const fragmentParams = new URLSearchParams(fragment);
      const idToken = fragmentParams.get('id_token');

      // Authorization code might be in fragment instead of query params for hybrid flow
      if (!code) {
        code = fragmentParams.get('code');
      }
      if (!state) {
        state = fragmentParams.get('state');
      }

      log.debug('Google OAuth callback received:', {
        code: !!code,
        state: !!state,
        error,
        idToken: !!idToken,
      });

      if (error) {
        log.error('Google OAuth error:', error, errorDescription);
        navigate('/auth/error', {
          state: {
            error: 'Google login failed',
            description: errorDescription || error,
          },
        });
        return;
      }

      // Check if this is a popup or regular window first
      if (window.opener && window.opener !== window) {
        // We're in a popup - send message to parent window
        window.opener.postMessage(
          {
            type: 'google-oauth-callback',
            code,
            state,
            idToken,
            error: error || errorDescription,
          },
          window.location.origin
        );

        // Show success message briefly then close
        setTimeout(() => {
          window.close();
        }, 1000);
        return; // Important: exit here to prevent further navigation
      }

      // We're in the main window - handle navigation
      if (!code || !state) {
        navigate('/auth/error', {
          state: {
            error: 'Invalid callback',
            description: 'Missing required parameters',
          },
        });
        return;
      }

      if (code && state) {
        // We're in the main window with success (fallback)
        log.info('Google OAuth successful, code received');
        navigate('/', {
          state: {
            authCode: code,
            authState: state,
            provider: 'google',
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
          Completing Google login...
        </Text>
        <Text size="sm" c="dimmed">
          Redirecting...
        </Text>
      </Stack>
    </Center>
  );
};
