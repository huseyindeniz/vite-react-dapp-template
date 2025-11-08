import React from 'react';

import { Center, Container, Divider, Group, Stack, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { CookieConsentMessage } from '@/features/components/CookieConsent/CookieConsentMessage';
import { ScrollToTopButton } from '@/features/components/ScrollToTopButton/ScrollToTopButton';
import { SecondaryMenu } from '@/features/components/SecondaryMenu/SecondaryMenu';
import { usePageLink } from '@/features/router/hooks/usePageLink';
import { usePages } from '@/features/router/hooks/usePages';

import { Copyright } from '../Copyright/Copyright';
import { SiteLogo } from '../SiteLogo/SiteLogo';
import { SocialMenu } from '../SocialMenu/SocialMenu';

export const Footer: React.FC = () => {
  const { t } = useTranslation('app');
  const { pageLink } = usePageLink();
  const { secondaryMenuItems } = usePages();

  const siteName = t('SITE_NAME');
  const baseUrl = pageLink('/');

  return (
    <>
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
    </>
  );
};
