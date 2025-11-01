import React, { JSX } from 'react';

import { OAuthProtectionWarning } from '../components/OAuthProtectionWarning/OAuthProtectionWarning';
import { useOAuth } from '../hooks/useOAuth';

export const withOAuthProtection = (
  ChildWithProps: React.ComponentType<unknown> | JSX.Element,
  CustomWarning: React.ReactElement | undefined = undefined
) => {
  const WithProtection: React.FC = () => {
    const { isAuthenticated } = useOAuth();
    if (isAuthenticated) {
      if (React.isValidElement(ChildWithProps)) {
        return ChildWithProps;
      }
      const Component = ChildWithProps as React.ComponentType<unknown>;
      return <Component />;
    }
    return CustomWarning ?? <OAuthProtectionWarning />;
  };
  return <WithProtection />;
};