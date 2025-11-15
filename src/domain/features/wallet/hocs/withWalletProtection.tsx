import React, { JSX } from 'react';

import { WalletProtectionWarning } from '../components/WalletProtectionWarning/WalletProtectionWarning';
import { useWalletAuthentication } from '../hooks/useWalletAuthentication';

export const withWalletProtection = (
  ChildWithProps: React.ComponentType<unknown> | JSX.Element,
  CustomWarning: React.ReactElement | undefined = undefined
) => {
  const WithProtection: React.FC = () => {
    const { isAuthenticated } = useWalletAuthentication();
    if (isAuthenticated) {
      if (React.isValidElement(ChildWithProps)) {
        return ChildWithProps;
      }
      const Component = ChildWithProps as React.ComponentType<unknown>;
      return <Component />;
    }
    return CustomWarning ?? <WalletProtectionWarning />;
  };
  return <WithProtection />;
};
