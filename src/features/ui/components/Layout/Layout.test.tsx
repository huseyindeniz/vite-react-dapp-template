import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { Layout } from './Layout';

vi.mock('./Header/Header', () => ({
  Header: () => <div data-testid="mock-header">Mock Header</div>,
}));

vi.mock('./Footer/Footer', () => ({
  Footer: () => <div data-testid="mock-footer">Mock Footer</div>,
}));

vi.mock('./ScrollToTopButton/ScrollToTopButton', () => ({
  ScrollToTopButton: () => (
    <div data-testid="mock-scroll-to-top-button">Mock ScrollToTopButton</div>
  ),
}));

vi.mock('./CookieConsent/CookieConsentMessage', () => ({
  CookieConsentMessage: () => (
    <div data-testid="mock-cookie-consent">Mock CookieConsent</div>
  ),
}));

describe.skip('Layout component', () => {
  it('should render correctly', async () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );
    const header = await screen.getByTestId('mock-header');
    expect(header).toBeInTheDocument();
    expect(await screen.getByTestId('mock-footer')).toBeInTheDocument();
    expect(
      await screen.getByTestId('mock-scroll-to-top-button')
    ).toBeInTheDocument();
    expect(await screen.getByTestId('mock-cookie-consent')).toBeInTheDocument();
  });
});
