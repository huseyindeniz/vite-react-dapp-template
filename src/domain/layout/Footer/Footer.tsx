import React from 'react';

import {
  AppShell,
  Center,
  Container,
  Divider,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { usePageLink } from '@/core/features/router/hooks/usePageLink';
import { usePages } from '@/core/features/router/hooks/usePages';
import { CookieConsentMessage } from '@/domain/layout/components/CookieConsent/CookieConsentMessage';
import { ScrollToTopButton } from '@/domain/layout/components/ScrollToTopButton/ScrollToTopButton';

import { Copyright } from '../components/Copyright/Copyright';
import { SecondaryMenu } from '../components/SecondaryMenu/SecondaryMenu';
import { SiteLogo } from '../components/SiteLogo/SiteLogo';
import { SocialMenu } from '../components/SocialMenu/SocialMenu';

export const Footer: React.FC = () => {
  const { t } = useTranslation('feature-site');
  const { pageLink } = usePageLink();
  const { secondaryMenuItems } = usePages();

  const siteName = t('SITE_NAME');
  const baseUrl = pageLink('/');

  return (
    <AppShell.Footer>
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
    </AppShell.Footer>
  );
};
