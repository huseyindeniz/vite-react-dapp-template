import React from 'react';

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
    <>
      {isAuthenticated ? (
        <ProfileDropdownMenu />
      ) : (
        <>
          <ConnectButton />
        </>
      )}
    </>
  );
};
