import React from 'react';

import { AppShell, Divider, Stack } from '@mantine/core';

import { uiConfig } from '@/config/core/ui/mantineProviderProps';
import { LangMenu } from '@/core/features/i18n/components/LangMenu/LangMenu';
import { MenuType } from '@/core/features/router/types/MenuType';
import { OAuth } from '@/domain/features/oauth/components/OAuth';
import { Wallet } from '@/domain/features/wallet/components/Wallet';
import { ColorSchemeSwitch } from '@/domain/layout/components/ColorSchemeSwitch/ColorSchemeSwitch';

import { MainMenu } from '../components/MainMenu/MainMenu';
import { SideNav } from '../SideNav/SideNav';

interface NavbarProps {
  mainMenuItems: MenuType[];
  hasSubRoutes: boolean;
  subRoutes: MenuType[];
  close: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  mainMenuItems,
  hasSubRoutes,
  subRoutes,
  close,
}) => {
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
        <OAuth size="sm" fullWidth />
        <Wallet />
      </Stack>
    </AppShell.Navbar>
  );
};
