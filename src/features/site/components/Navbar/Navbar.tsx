import React from 'react';

import { Divider, Stack } from '@mantine/core';

import { ColorSchemeSwitch } from '@/features/components/ColorSchemeSwitch/ColorSchemeSwitch';
import { MainMenu } from '@/features/components/MainMenu/MainMenu';
import { SideNav } from '@/features/components/SideNav/SideNav';
import { LangMenu } from '@/features/i18n/components/LangMenu/LangMenu';
import { Layout } from '@/features/layout/components/Layout';
import { OAuth } from '@/features/oauth/components/OAuth';
import { MenuType } from '@/features/router/types/MenuType';
import { Wallet } from '@/features/wallet/components/Wallet';

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
    <Layout.Navbar>
      <MainMenu mainMenuItems={mainMenuItems} onClick={close} vertical />
      {hasSubRoutes && (
        <>
          <Divider my="sm" />
          <SideNav items={subRoutes} />
        </>
      )}
      <Divider my="sm" />
      <Stack align="center" gap="sm">
        <LangMenu />
        <ColorSchemeSwitch />
        <OAuth size="sm" fullWidth />
        <Wallet />
      </Stack>
    </Layout.Navbar>
  );
};
