// ConnectButton.stories.ts|tsx
import type { Meta, StoryObj } from '@storybook/react';

import { ThemeSwitcher } from './ThemeSwitcher';

const meta: Meta<typeof ThemeSwitcher> = { component: ThemeSwitcher };
export default meta;

type Story = StoryObj<typeof ThemeSwitcher>;

export const Default: Story = {
  args: {},
};
