import { render } from '@testing-library/react';

import { CookieConsent } from './CookieConsent';

describe('Feature: UI', () => {
  describe('Component: Layout/CookieConsent', () => {
    it('should render with default props', () => {
      const { asFragment } = render(<CookieConsent />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should render with debug enabled', () => {
      const { asFragment } = render(<CookieConsent debug />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
