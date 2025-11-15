import { render, screen } from '@test-utils';
import { HelmetProvider } from 'react-helmet-async';

import { HomePage } from './Home';

describe('HomePage', () => {
  it('should render the component', () => {
    render(
      <HelmetProvider>
        <HomePage />
      </HelmetProvider>
    );

    // Check main heading - text is split across multiple elements
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(/Build Modern.*Web, dApp & AI Assistant.*User Interfaces/i);

    // Check description
    const description = screen.getByText(/A production-ready React template/i);
    expect(description).toBeInTheDocument();

    // Check GitHub button
    const githubButton = screen.getByRole('link', { name: /View on GitHub/i });
    expect(githubButton).toBeInTheDocument();
    expect(githubButton).toHaveAttribute('href', 'https://github.com/huseyindeniz/vite-react-dapp-template');
  });
});
