import React from 'react';

import { AuthButton } from './AuthButton/AuthButton';

interface AuthProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'filled' | 'light' | 'outline' | 'subtle';
  fullWidth?: boolean;
}

export const Auth: React.FC<AuthProps> = (props) => {
  return <AuthButton {...props} />;
};