// ConnectButton.stories.ts|tsx
import type { Meta, StoryObj } from '@storybook/react';
import { withRouter } from 'storybook-addon-react-router-v6';

import { SiteLogo } from './SiteLogo';

const meta: Meta<typeof SiteLogo> = {
  component: SiteLogo,
  decorators: [withRouter],
};
export default meta;

type Story = StoryObj<typeof SiteLogo>;

export const Default: Story = {
  args: {
    siteName: 'Mock Site Name',
  },
};
