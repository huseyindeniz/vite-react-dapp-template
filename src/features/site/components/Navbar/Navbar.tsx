import React from 'react';

import { Divider, Stack } from '@mantine/core';

import { ColorSchemeSwitch } from '@/features/components/ColorSchemeSwitch/ColorSchemeSwitch';
import { LangMenu } from '@/features/i18n/components/LangMenu/LangMenu';
import { Layout } from '@/features/layout/components/Layout';
import { OAuth } from '@/features/oauth/components/OAuth';
import { MenuType } from '@/features/router/types/MenuType';
import { Wallet } from '@/features/wallet/components/Wallet';

import { MainMenu } from '../MainMenu/MainMenu';
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
    <Layout.Navbar>
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
        <ColorSchemeSwitch />
        <OAuth size="sm" fullWidth />
        <Wallet />
      </Stack>
    </Layout.Navbar>
  );
};
