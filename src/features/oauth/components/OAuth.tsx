import React from 'react';

import { OAuthButton } from './OAuthButton/OAuthButton';

interface OAuthProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'filled' | 'light' | 'outline' | 'subtle';
  fullWidth?: boolean;
}

export const OAuth: React.FC<OAuthProps> = (props) => {
  return <OAuthButton {...props} />;
};