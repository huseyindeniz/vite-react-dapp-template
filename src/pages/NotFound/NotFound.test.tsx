import { render } from '@test-utils';
import { MemoryRouter } from 'react-router-dom';

import { NotFoundPage } from './NotFound';

vi.mock('../usePageLink', () => {
  return {
    usePageLink: vi.fn(() => '/'),
  };
});

describe.skip('NotFoundPage', () => {
  it('should render the component', () => {
    const { getByText } = render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    // Assert
    expect(getByText('404 Page Not Found')).toBeInTheDocument();
    expect(getByText('Back To Home?')).toBeInTheDocument();
    expect(getByText('Yes')).toBeInTheDocument();
    expect(getByText('No')).toBeInTheDocument();
  });
});
