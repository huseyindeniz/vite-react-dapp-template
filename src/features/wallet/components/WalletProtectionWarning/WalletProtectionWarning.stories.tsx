// WalletProtectionWarning.stories.ts|tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { LoadingStatusType } from '../../models/types/LoadingStatus';

import { WalletProtectionWarning } from './WalletProtectionWarning';

const mockStore = configureStore([]);

const meta: Meta<typeof WalletProtectionWarning> = {
  component: WalletProtectionWarning,
  decorators: [
    Story => {
      const store = mockStore({
        wallet: {
          state: {
            loading: LoadingStatusType.IDLE,
          },
        },
      });
      return (
        <Provider store={store}>
          <Story />
        </Provider>
      );
    },
  ],
};
export default meta;

type Story = StoryObj<typeof WalletProtectionWarning>;

export const Default: Story = { args: {} };
