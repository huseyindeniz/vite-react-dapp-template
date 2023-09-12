import { render } from '@testing-library/react';

import { Footer } from './Footer';

jest.mock('../Copyright/Copyright', () => ({
  Copyright: () => <div data-testid="mock-copyright" />,
}));

jest.mock('../SecondaryMenu/SecondaryMenu', () => ({
  SecondaryMenu: () => <div data-testid="mock-secondary-menu" />,
}));

jest.mock('../SiteLogo/SiteLogo', () => ({
  SiteLogo: () => <div data-testid="mock-site-logo" />,
}));

jest.mock('../SocialMenu/SocialMenu', () => ({
  SocialMenu: () => <div data-testid="mock-social-menu" />,
}));

describe('Feature: UI', () => {
  describe('Component: Layout/Footer', () => {
    it('should render the component', () => {
      const { getByTestId } = render(
        <Footer siteName="Test Site" baseUrl="/" secondaryMenuItems={[]} />
      );

      expect(getByTestId('mock-copyright')).toBeInTheDocument();
      expect(getByTestId('mock-secondary-menu')).toBeInTheDocument();
      expect(getByTestId('mock-site-logo')).toBeInTheDocument();
      expect(getByTestId('mock-social-menu')).toBeInTheDocument();
    });
  });
});
