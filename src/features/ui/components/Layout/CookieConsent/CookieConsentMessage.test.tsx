import { render } from '@testing-library/react';

import { CookieConsentMessage } from './CookieConsentMessage';

describe('Feature: UI', () => {
  describe('Component: Layout/CookieConsentMessage', () => {
    it('should render with default props', () => {
      const { asFragment } = render(<CookieConsentMessage />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should render with debug enabled', () => {
      const { asFragment } = render(<CookieConsentMessage debug />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
