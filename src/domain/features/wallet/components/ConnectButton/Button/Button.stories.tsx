// Button.stories.ts|tsx
import { Meta, StoryObj } from '@storybook/react';

import { Button } from './Button';

const meta: Meta<typeof Button> = { component: Button };
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {},
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};
