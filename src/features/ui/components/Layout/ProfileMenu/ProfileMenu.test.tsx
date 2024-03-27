import { render } from '@testing-library/react';

import { ProfileMenu } from './ProfileMenu';

vi.mock('@/features/wallet/components/Wallet', () => ({
  Wallet: () => <div data-testid="mock-wallet" />,
}));

describe('Feature: UI', () => {
  describe('Component: Layout/ProfileMenu', () => {
    it('should render the component', () => {
      const { getByTestId } = render(<ProfileMenu />);

      expect(getByTestId('mock-wallet')).toBeInTheDocument();
    });
  });
});
