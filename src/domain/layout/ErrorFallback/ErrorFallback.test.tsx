import { render } from '@test-utils';

import { ErrorFallback } from './ErrorFallback';

describe('Feature: UI', () => {
  describe('Component: Layout/ErrorFallback', () => {
    it('should be visible and show error message', () => {
      // Arrange
      const error = new Error('Mock error message');
      const { asFragment, getByText } = render(<ErrorFallback error={error} />);
      // Assert
      expect(getByText('An unexpected error occurred!')).toBeVisible();
      expect(getByText('Mock error message')).toBeVisible();
      expect(asFragment).toMatchSnapshot();
    });
  });
});
