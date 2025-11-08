import React from 'react';

import { Burger, Group } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { ColorSchemeSwitch } from '@/features/components/ColorSchemeSwitch/ColorSchemeSwitch';
import { MainMenu } from '@/features/components/MainMenu/MainMenu';
import { LangMenu } from '@/features/i18n/components/LangMenu/LangMenu';
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
  const { t } = useTranslation('app');
  const { pageLink } = usePageLink();
  const { mainMenuItems } = usePages();

  const siteName = t('SITE_NAME');
  const baseUrl = pageLink('/');

  return (
    <>
      <Burger
        opened={opened}
        onClick={toggle}
        hiddenFrom="sm"
        size="sm"
      />
      <Group>
        <SiteLogo siteName={siteName} baseUrl={baseUrl} />
        <Group ml="xl" gap={0} visibleFrom="sm">
          <MainMenu mainMenuItems={mainMenuItems} onClick={close} />
        </Group>
      </Group>
      <Group visibleFrom="sm">
        <LangMenu />
        <ColorSchemeSwitch />
        <OAuth size="sm" />
        <Wallet />
      </Group>
    </>
  );
};
