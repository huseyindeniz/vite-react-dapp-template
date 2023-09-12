import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

import { HomePage } from './Home';

describe('HomePage', () => {
  it('should render the component', () => {
    const { getByText } = render(
      <HelmetProvider>
        <HomePage />
      </HelmetProvider>
    );
    const title = getByText('Vite React dApp Template');
    const description = getByText(
      'Vite React dApp Template is a Vite React template specifically designed for decentralized application (dApp) frontend development.'
    );
    const learnReactButton = getByText('Learn React');
    const learnDappCraTemplateButton = getByText(
      'Learn Vite React dApp Template'
    );

    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(learnReactButton).toBeInTheDocument();
    expect(learnDappCraTemplateButton).toBeInTheDocument();
  });
});
