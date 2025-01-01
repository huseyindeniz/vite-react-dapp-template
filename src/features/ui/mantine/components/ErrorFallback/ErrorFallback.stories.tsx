// ConnectButton.stories.ts|tsx
import type { Meta, StoryObj } from '@storybook/react';

import { ErrorFallback } from './ErrorFallback';

const meta: Meta<typeof ErrorFallback> = { component: ErrorFallback };
export default meta;

type Story = StoryObj<typeof ErrorFallback>;

export const Default: Story = {
  args: {
    error: new Error('Mock error message'),
  },
};
