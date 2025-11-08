// ConnectButton.stories.ts|tsx
import type { Meta, StoryObj } from '@storybook/react';

import { CookieConsentMessage } from './CookieConsentMessage';

const meta: Meta<typeof CookieConsentMessage> = {
  component: CookieConsentMessage,
};
export default meta;

type Story = StoryObj<typeof CookieConsentMessage>;

export const Default: Story = {
  args: {
    debug: true,
  },
};
