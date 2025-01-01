// ConnectButton.stories.ts|tsx
import type { Meta, StoryObj } from '@storybook/react';

import { Copyright } from './Copyright';

const meta: Meta<typeof Copyright> = { component: Copyright };
export default meta;

type Story = StoryObj<typeof Copyright>;

export const Default: Story = {
  args: {},
};
