// ConnectButton.stories.ts|tsx
import type { Meta, StoryObj } from '@storybook/react';

import { WalletProtectionWarning } from './WalletProtectionWarning';

const meta: Meta<typeof WalletProtectionWarning> = {
  component: WalletProtectionWarning,
};
export default meta;

type Story = StoryObj<typeof WalletProtectionWarning>;

export const Default: Story = { args: {} };
