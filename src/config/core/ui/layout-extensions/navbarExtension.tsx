import React from 'react';

import { Navbar } from '@/domain/layout/Navbar/Navbar';

interface NavbarExtensionProps {
  close: () => void;
}

export const NavbarExtension: React.FC<NavbarExtensionProps> = ({ close }) => {
  return <Navbar close={close} />;
};
