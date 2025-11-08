import { AppShell } from '@mantine/core';

export const LayoutAside = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppShell.Aside p="md">
      {children}
    </AppShell.Aside>
  );
};
