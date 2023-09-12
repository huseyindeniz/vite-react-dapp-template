import React from "react";

import { WalletProtectionWarning } from "../components/WalletProtectionWarning/WalletProtectionWarning";
import { useWalletAuthentication } from "../hooks/useWalletAuthentication";

export const withWalletProtection = (
  ChildWithProps: React.ComponentType<unknown | string>,
  CustomWarning: React.ReactElement | undefined = undefined
) => {
  const WithProtection: React.FC = () => {
    const { isAuthenticated } = useWalletAuthentication();
    return isAuthenticated ? (
      <ChildWithProps />
    ) : (
      CustomWarning ?? <WalletProtectionWarning />
    );
  };
  return WithProtection;
};
