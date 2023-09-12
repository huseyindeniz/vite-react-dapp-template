import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { NotFoundPage } from './NoteFound';

jest.mock('../usePageLink', () => {
  return {
    usePageLink: jest.fn(() => '/'),
  };
});

describe.skip('NoteFoundPage', () => {
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
