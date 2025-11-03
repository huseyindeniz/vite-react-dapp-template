import { AppShell } from '@mantine/core';

export const LayoutNavbar = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppShell.Navbar py="md" px={4}>
      {children}
    </AppShell.Navbar>
  );
};
