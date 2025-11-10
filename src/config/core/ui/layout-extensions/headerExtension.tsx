import React from 'react';

import { Header } from '@/domain/layout/Header/Header';

interface HeaderExtensionProps {
  opened: boolean;
  toggle: () => void;
  close: () => void;
}

export const HeaderExtension: React.FC<HeaderExtensionProps> = ({
  opened,
  toggle,
  close,
}) => {
  return <Header opened={opened} toggle={toggle} close={close} />;
};
