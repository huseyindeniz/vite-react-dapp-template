import React from 'react';

import { AppShell, Divider, Stack } from '@mantine/core';

import { uiConfig } from '@/config/core/ui/mantineProviderProps';
import { FEATURE_ENABLED as OAUTH_ENABLED } from '@/config/domain/oauth/config';
import { LangMenu } from '@/core/features/i18n/components/LangMenu/LangMenu';
import { useActiveRoute } from '@/core/features/router/hooks/useActiveRoute';
import { usePages } from '@/core/features/router/hooks/usePages';
import { OAuth } from '@/domain/features/oauth/components/OAuth';
import { Wallet } from '@/domain/features/wallet/components/Wallet';
import { ColorSchemeSwitch } from '@/domain/layout/components/ColorSchemeSwitch/ColorSchemeSwitch';

import { MainMenu } from '../components/MainMenu/MainMenu';
import { SideNav } from '../SideNav/SideNav';

interface NavbarProps {
  close: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ close }) => {
  const { mainMenuItems, pageRoutes } = usePages();
  const { hasSubRoutes, subRoutes } = useActiveRoute(pageRoutes);

  return (
    <AppShell.Navbar py="md" px={4}>
      <MainMenu mainMenuItems={mainMenuItems} onClick={close} vertical />
      {hasSubRoutes && (
        <>
          <Divider my="sm" />
          <SideNav items={subRoutes} onClick={close} />
        </>
      )}
      <Divider my="sm" />
      <Stack align="center" gap="sm">
        <LangMenu />
        {uiConfig.showColorSchemeSwitch && <ColorSchemeSwitch />}
        {OAUTH_ENABLED && <OAuth size="sm" fullWidth />}
        <Wallet />
      </Stack>
    </AppShell.Navbar>
  );
};
