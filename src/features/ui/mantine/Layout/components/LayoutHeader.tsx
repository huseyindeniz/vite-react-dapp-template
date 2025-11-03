import { AppShell, Group } from '@mantine/core';

export const LayoutHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppShell.Header>
      <Group h="100%" px="md" justify="space-between">
        {children}
      </Group>
    </AppShell.Header>
  );
};
