// ProfileDropdownMenu.stories.ts|tsx
import type { Meta, StoryObj } from '@storybook/react';
import { withRouter } from 'storybook-addon-react-router-v6';

import { DropdownMenu } from './DropdownMenu';

const meta: Meta<typeof DropdownMenu> = {
  component: DropdownMenu,
  decorators: [withRouter],
};
export default meta;

type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = { args: {} };

export const Address: Story = {
  args: {
    address: '0x0000000000000000000000000000000000000000',
    domainOrAddressTruncated: '0x0000...0000',
  },
};

export const Ens: Story = {
  args: {
    address: '0x0000000000000000000000000000000000000000',
    domainOrAddressTruncated: 'mockEnsName.eth',
  },
};
