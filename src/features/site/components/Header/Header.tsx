import React from 'react';

import { Burger, Group } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { LAYOUT_BREAKPOINTS } from '@/config/ui/layout-breakpoints';
import { ColorSchemeSwitch } from '@/features/components/ColorSchemeSwitch/ColorSchemeSwitch';
import { MainMenu } from '@/features/components/MainMenu/MainMenu';
import { LangMenu } from '@/features/i18n/components/LangMenu/LangMenu';
import { Layout } from '@/features/layout/components/Layout';
import { OAuth } from '@/features/oauth/components/OAuth';
import { usePageLink } from '@/features/router/hooks/usePageLink';
import { usePages } from '@/features/router/hooks/usePages';
import { Wallet } from '@/features/wallet/components/Wallet';

import { SiteLogo } from '../SiteLogo/SiteLogo';

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
    <Layout.Header>
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
        <ColorSchemeSwitch />
        <OAuth size="sm" />
        <Wallet />
      </Group>
    </Layout.Header>
  );
};
