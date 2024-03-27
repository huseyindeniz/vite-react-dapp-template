import { render } from '@testing-library/react';

import { Footer } from './Footer';

vi.mock('../Copyright/Copyright', () => ({
  Copyright: () => <div data-testid="mock-copyright" />,
}));

vi.mock('../SecondaryMenu/SecondaryMenu', () => ({
  SecondaryMenu: () => <div data-testid="mock-secondary-menu" />,
}));

vi.mock('../SiteLogo/SiteLogo', () => ({
  SiteLogo: () => <div data-testid="mock-site-logo" />,
}));

vi.mock('../SocialMenu/SocialMenu', () => ({
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
