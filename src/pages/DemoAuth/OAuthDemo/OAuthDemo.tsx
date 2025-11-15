import React from 'react';

import { Stack, Title, Text, Alert } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IoIosWarning } from 'react-icons/io';

import { withOAuthProtection } from '@/domain/features/oauth/hocs/withOAuthProtection';
import { PageMeta } from '@/domain/layout/components/PageMeta/PageMeta';

export const OAuthDemoPage: React.FC = () => {
  const { t } = useTranslation('page-demoauth-oauthdemo');

  return (
    <>
      <PageMeta
        title={t('OAuth Authentication Demo')}
        url="/auth-demo/oauth"
        description={t('OAuth/Social login demo with Google and GitHub')}
      />
      <Stack gap="md">
        <Title order={2}>{t('OAuth/Social Login Demo')}</Title>
        <Text>
          {t(
            'This page demonstrates OAuth authentication with social providers like Google and GitHub. Use the Auth button in the header to sign in.'
          )}
        </Text>
        {withOAuthProtection(
          <Alert title={t('Logged In!')} color="green">
            {t(
              'You have successfully authenticated using OAuth. This content is only visible to authenticated users.'
            )}
          </Alert>,
          <Alert title={t('Login Required')} icon={<IoIosWarning />}>
            {t(
              'Please log in with Google or GitHub to view the protected content on this page.'
            )}
          </Alert>
        )}
        <Text c="dimmed" size="sm">
          {t(
            'This demonstrates the withOAuthProtection HOC pattern for OAuth-based conditional rendering.'
          )}
        </Text>
      </Stack>
    </>
  );
};
