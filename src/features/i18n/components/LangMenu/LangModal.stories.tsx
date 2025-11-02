// ConnectButton.stories.ts|tsx
import type { Meta, StoryObj } from '@storybook/react';

import { LangCode } from '../../types/LangCode';

import { LangModal } from './LangModal';

const meta: Meta<typeof LangModal> = {
  component: LangModal,
  args: {
    defaultValue: 'en-US',
    isOpen: true,
    onChange: () => null,
    onClose: () => null,
    supportedLanguages: [
      {
        code: LangCode.EN_US,
        label: 'English (US)',
      },
      {
        code: LangCode.TR_TR,
        label: 'Türkçe',
      },
    ],
  },
};
export default meta;

type Story = StoryObj<typeof LangModal>;

export const Default: Story = {
  args: {},
};
