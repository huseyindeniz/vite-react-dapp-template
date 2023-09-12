import { fireEvent, render } from '@testing-library/react';

import { ScrollToTopButton } from './ScrollToTopButton';

describe.skip('Feature: UI', () => {
  describe('Component: Layout/ScrollToTopButton', () => {
    it('renders a button when the scroll position is greater than 300 and scrolls to the top of the page when the button is clicked', () => {
      // Arrange
      const mockWindow = {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        pageYOffset: 400,
        scrollTo: jest.fn(),
      };
      (global as any).window = mockWindow;

      // Act
      const { getByLabelText } = render(<ScrollToTopButton />);

      fireEvent.click(getByLabelText('Go To Top'));

      // Assert
      expect(getByLabelText('Go To Top')).toBeInTheDocument();
      expect(mockWindow.scrollTo).toHaveBeenCalledWith({ top: 0 });
    });

    it('does not render a button when the scroll position is less than 300', () => {
      // Arrange
      const mockWindow = {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        pageYOffset: 200,
      };
      (global as any).window = mockWindow;

      // Act
      const { queryByLabelText } = render(<ScrollToTopButton />);

      // Assert
      expect(queryByLabelText('Go To Top')).toBeNull();
    });

    it('removes the scroll event listener when the component unmounts', () => {
      // Arrange
      const mockWindow = {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        pageYOffset: 400,
      };
      (global as any).window = mockWindow;

      // Act
      const { unmount } = render(<ScrollToTopButton />);
      unmount();

      // Assert
      expect(mockWindow.removeEventListener).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function)
      );
    });
  });
});
