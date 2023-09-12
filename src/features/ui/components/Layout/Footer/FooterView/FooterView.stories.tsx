import type { Meta, StoryObj } from '@storybook/react';

import { FooterView } from './FooterView';

const meta: Meta<typeof FooterView> = { component: FooterView };
export default meta;

type Story = StoryObj<typeof FooterView>;

export const Default: Story = {
  args: {
    firstRowContent: <div>First row content</div>,
    secondRowContent: <div>Second row content</div>,
  },
};

export const OnlyFirstRow: Story = {
  args: {
    firstRowContent: <div>Only first row content</div>,
  },
};

export const OnlySecondRow: Story = {
  args: {
    secondRowContent: <div>Only second row content</div>,
  },
};
