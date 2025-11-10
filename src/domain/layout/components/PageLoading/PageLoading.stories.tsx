import { Meta, StoryObj } from '@storybook/react';

import { PageLoading } from './PageLoading';

const meta: Meta<typeof PageLoading> = { component: PageLoading };
export default meta;

type Story = StoryObj<typeof PageLoading>;

export const Default: Story = {
  args: {},
};
