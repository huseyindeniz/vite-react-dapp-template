import { render, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { initialState as initialAccountState } from '../models/account/slice';
import { initialState as initialNetworkState } from '../models/network/slice';
import { initialState as initialProviderState } from '../models/provider/slice';
import { WalletState } from '../models/types/WalletState';

import { Wallet } from './Wallet';

const mockWalletState = {
  state: WalletState.NOT_INITIALIZED,
  provider: initialProviderState,
  account: initialAccountState,
  network: initialNetworkState,
};

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
}));

afterEach(cleanup);

describe('UserModal', () => {
  it('renders without crashing', () => {
    const mockStore = configureStore();
    const store = mockStore({ wallet: mockWalletState });
    const { container } = render(
      <Provider store={store}>
        <Wallet />
      </Provider>
    );
    expect(container).toBeInTheDocument();
  });
});
