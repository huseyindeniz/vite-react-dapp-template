// ConnectButton.stories.ts|tsx
import type { Meta, StoryObj } from '@storybook/react';

import { AlertMessage } from './AlertMessage';

const meta: Meta<typeof AlertMessage> = { component: AlertMessage };
export default meta;

type Story = StoryObj<typeof AlertMessage>;

const mockTitle =
  'veryverylongwordtesttoseehowitlooks Lorem ipsum dolor sit amet';

const mockContent =
  'veryverylongwordtesttoseehowitlooks Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ultricies nibh non orci pharetra fringilla. Etiam bibendum, dui non pretium porttitor, lectus ligula suscipit odio, sed ultrices nulla quam ac ante. Vivamus quis ipsum facilisis, interdum sem quis, posuere augue. Sed eu enim tortor. Proin vel risus semper, elementum velit eu, blandit metus. Quisque sapien dolor, fringilla nec mi sed, sodales vulputate diam. Nulla arcu augue, venenatis eu purus et, fringilla commodo urna.';

export const Error: Story = {
  args: {
    status: 'error',
    title: mockTitle,
    children: mockContent,
  },
};

export const Info: Story = {
  args: {
    status: 'info',
    title: 'Mock Info Title with long text',
    children: mockContent,
  },
};

export const Warning: Story = {
  args: {
    status: 'warning',
    title: 'Mock Warning Title with long text',
    children: mockContent,
  },
};

export const Success: Story = {
  args: {
    status: 'success',
    title: 'Mock Success Title with long text',
    children: mockContent,
  },
};

export const Loading: Story = {
  args: {
    status: 'loading',
    title: 'Mock Loading Title with long text',
    children: mockContent,
  },
};
