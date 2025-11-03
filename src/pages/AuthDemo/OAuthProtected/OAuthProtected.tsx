import React from 'react';

import { Stack, Title, Text, Alert, Code } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { PageMeta } from '@/features/ui/mantine/components/PageMeta/PageMeta';

export const OAuthProtected: React.FC = () => {
  const { t } = useTranslation('page-authdemo-oauthprotected');

  return (
    <>
      <PageMeta
        title={t('OAuth Protected Page')}
        url="/auth-demo/oauth-protected"
        description={t('Fully protected page requiring OAuth authentication')}
      />
      <Stack gap="md">
        <Title order={2}>{t('OAuth Protected Page')}</Title>
        <Alert title={t('Protected Route')} color="blue">
          {t('This entire page is protected by OAuth authentication at the route level. You can only access this page if you have logged in with Google or GitHub.')}
        </Alert>
        <Text>
          {t('Unlike the OAuth Demo page which uses conditional rendering, this page uses route-level protection configured in the routes configuration.')}
        </Text>
        <Code block>
          protectionType: ProtectionType.OAUTH
        </Code>
        <Text c="dimmed" size="sm">
          {t('If you can see this page, you have successfully authenticated via OAuth.')}
        </Text>
      </Stack>
    </>
  );
};