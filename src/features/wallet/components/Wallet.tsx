import React from 'react';

import { useWalletAuthentication } from '../hooks/useWalletAuthentication';

import { ConnectButton } from './ConnectButton/ConnectButton';
import { ProfileDropdownMenu } from './ProfileDropdownMenu/ProfileDropdownMenu';

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
