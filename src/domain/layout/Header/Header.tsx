import React from 'react';

import { AppShell, Burger, Group } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { LAYOUT_BREAKPOINTS } from '@/config/core/ui/layout-breakpoints';
import { uiConfig } from '@/config/core/ui/mantineProviderProps';
import { FEATURE_ENABLED as OAUTH_ENABLED } from '@/config/domain/oauth/config';
import { LangMenu } from '@/core/features/i18n/components/LangMenu/LangMenu';
import { usePageLink } from '@/core/features/router/hooks/usePageLink';
import { usePages } from '@/core/features/router/hooks/usePages';
import { OAuth } from '@/domain/features/oauth/components/OAuth';
import { Wallet } from '@/domain/features/wallet/components/Wallet';
import { ColorSchemeSwitch } from '@/domain/layout/components/ColorSchemeSwitch/ColorSchemeSwitch';

import { MainMenu } from '../components/MainMenu/MainMenu';
import { SiteLogo } from '../components/SiteLogo/SiteLogo';

interface HeaderProps {
  opened: boolean;
  toggle: () => void;
  close: () => void;
}

export const Header: React.FC<HeaderProps> = ({ opened, toggle, close }) => {
  const { t } = useTranslation('feature-site');
  const { pageLink } = usePageLink();
  const { mainMenuItems } = usePages();

  const siteName = t('SITE_NAME');
  const baseUrl = pageLink('/');

  return (
    <AppShell.Header>
      <Group h="100%" px="md" justify="space-between">
        <Burger
          opened={opened}
          onClick={toggle}
          hiddenFrom={LAYOUT_BREAKPOINTS.MOBILE}
          size="sm"
        />
        <Group>
          <SiteLogo siteName={siteName} baseUrl={baseUrl} />
          <Group ml="xl" gap={0} visibleFrom={LAYOUT_BREAKPOINTS.MOBILE}>
            <MainMenu mainMenuItems={mainMenuItems} onClick={close} />
          </Group>
        </Group>
        <Group visibleFrom={LAYOUT_BREAKPOINTS.MOBILE}>
          <LangMenu />
          {uiConfig.showColorSchemeSwitch && <ColorSchemeSwitch />}
          {OAUTH_ENABLED && <OAuth size="sm" />}
          <Wallet />
        </Group>
      </Group>
    </AppShell.Header>
  );
};
