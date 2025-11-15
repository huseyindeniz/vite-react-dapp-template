// ConnectButton.stories.ts|tsx
import { Meta, StoryObj } from '@storybook/react';

import { SocialMenu } from './SocialMenu';

const meta: Meta<typeof SocialMenu> = { component: SocialMenu };
export default meta;

type Story = StoryObj<typeof SocialMenu>;

export const Default: Story = {
  args: {},
};
