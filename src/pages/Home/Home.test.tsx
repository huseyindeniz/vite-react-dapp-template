import { render } from '@test-utils';
import { HelmetProvider } from 'react-helmet-async';

import { HomePage } from './Home';

describe('HomePage', () => {
  it('should render the component', () => {
    const { getByText } = render(
      <HelmetProvider>
        <HomePage />
      </HelmetProvider>
    );
    const title = getByText('React dApp Template (Vite)');
    const description = getByText(
      'React dApp Template (Vite) is a Vite React template specifically designed for decentralized application (dApp) frontend development.'
    );
    const learnReactButton = getByText('Learn React');
    const learnDappCraTemplateButton = getByText(
      'Learn React dApp Template (Vite)'
    );

    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(learnReactButton).toBeInTheDocument();
    expect(learnDappCraTemplateButton).toBeInTheDocument();
  });
});
