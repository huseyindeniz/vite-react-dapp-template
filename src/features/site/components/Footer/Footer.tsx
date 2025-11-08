import React from 'react';

import { Center, Container, Divider, Group, Stack, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { CookieConsentMessage } from '@/features/components/CookieConsent/CookieConsentMessage';
import { ScrollToTopButton } from '@/features/components/ScrollToTopButton/ScrollToTopButton';
import { Layout } from '@/features/layout/components/Layout';
import { usePageLink } from '@/features/router/hooks/usePageLink';
import { usePages } from '@/features/router/hooks/usePages';

import { Copyright } from '../Copyright/Copyright';
import { SecondaryMenu } from '../SecondaryMenu/SecondaryMenu';
import { SiteLogo } from '../SiteLogo/SiteLogo';
import { SocialMenu } from '../SocialMenu/SocialMenu';

export const Footer: React.FC = () => {
  const { t } = useTranslation('feature-site');
  const { pageLink } = usePageLink();
  const { secondaryMenuItems } = usePages();

  const siteName = t('SITE_NAME');
  const baseUrl = pageLink('/');

  return (
    <Layout.Footer>
      <Container>
        <Center>
          <SecondaryMenu secondaryMenuItems={secondaryMenuItems} />
        </Center>
        <Divider
          label={
            <Stack gap={0} align="center" justify="center">
              <SiteLogo siteName={siteName} baseUrl={baseUrl} />
              <Text c="dimmed" fz="xs">
                v{__VITE_REACT_APP_VERSION__}
              </Text>
            </Stack>
          }
        />
        <Group justify="space-between" style={{ flex: 1 }} mt={-10}>
          <Copyright />
          <SocialMenu />
        </Group>
      </Container>
      <ScrollToTopButton />
      <CookieConsentMessage />
    </Layout.Footer>
  );
};
