import React, { JSX } from 'react';

import { AuthProtectionWarning } from '../components/AuthProtectionWarning/AuthProtectionWarning';
import { useAuth } from '../hooks/useAuth';

export const withAuthProtection = (
  ChildWithProps: React.ComponentType<unknown> | JSX.Element,
  CustomWarning: React.ReactElement | undefined = undefined
) => {
  const WithProtection: React.FC = () => {
    const { isAuthenticated } = useAuth();
    if (isAuthenticated) {
      if (React.isValidElement(ChildWithProps)) {
        return ChildWithProps;
      }
      const Component = ChildWithProps as React.ComponentType<unknown>;
      return <Component />;
    }
    return CustomWarning ?? <AuthProtectionWarning />;
  };
  return <WithProtection />;
};