import React from 'react';

import { Loader } from '@mantine/core';

import { useWalletAuthentication } from '../hooks/useWalletAuthentication';

import { ConnectButton } from './ConnectButton/ConnectButton';

const ProfileDropdownMenu = React.lazy(() =>
  import(
    /* webpackChunkName: "ProfileDropdownMenu" */ './ProfileDropdownMenu/ProfileDropdownMenu'
  ).then(module => ({
    default: module.ProfileDropdownMenu,
  }))
);

export const Wallet: React.FC = () => {
  const { isAuthenticated } = useWalletAuthentication();
  return (
    <React.Suspense fallback={<Loader size="xs" />}>
      {isAuthenticated ? <ProfileDropdownMenu /> : <ConnectButton />}
    </React.Suspense>
  );
};
