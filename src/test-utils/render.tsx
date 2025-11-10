// ./test-utils/render.tsx
import { MantineProvider } from '@mantine/core';
import { render as testingLibraryRender } from '@testing-library/react';

import { mantineProviderProps } from '@/config/core/ui/mantineProviderProps';

export function render(ui: React.ReactNode) {
  return testingLibraryRender(<>{ui}</>, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <MantineProvider {...mantineProviderProps}>{children}</MantineProvider>
    ),
  });
}
