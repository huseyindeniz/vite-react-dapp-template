import React from 'react';

import { Main } from '@/domain/layout/Main/Main';

interface MainExtensionProps {
  fullWidth: boolean;
}

export const MainExtension: React.FC<MainExtensionProps> = ({ fullWidth }) => {
  return <Main fullWidth={fullWidth} />;
};
