import React from 'react';

import { LangMenu } from '@/features/i18n/components/LangMenu/LangMenu';
import { OAuth } from '@/features/oauth/components/OAuth';
import { ColorSchemeSwitch } from '@/features/ui/mantine/components/ColorSchemeSwitch/ColorSchemeSwitch';
import { Wallet } from '@/features/wallet/components/Wallet';

import { features } from '../features';

export const NavbarExtension: React.FC = () => {
  return (
    <>
      <LangMenu />
      <ColorSchemeSwitch />
      {features.oauth.enabled && <OAuth size="sm" fullWidth />}
      {features.wallet.enabled && <Wallet />}
    </>
  );
};
