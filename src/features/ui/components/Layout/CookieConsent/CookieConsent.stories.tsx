// ConnectButton.stories.ts|tsx
import type { Meta, StoryObj } from '@storybook/react';

import { CookieConsent } from './CookieConsent';

const meta: Meta<typeof CookieConsent> = { component: CookieConsent };
export default meta;

type Story = StoryObj<typeof CookieConsent>;

export const Default: Story = {
  args: {
    debug: true,
  },
};
