import { render, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

import { PageMeta } from './PageMeta';

describe('PageMeta', () => {
  it('should render the correct meta tags', async () => {
    const title = 'My Page';
    const url = '/whitepaper';
    const description = 'This is my page';
    const image = 'test.jpg';

    render(
      <HelmetProvider>
        <PageMeta
          title={title}
          url={url}
          description={description}
          image={image}
        />
      </HelmetProvider>
    );

    // Wait for the Helmet component to update the document head
    await waitFor(() => {
      expect(document.title).toBe(title);

      expect(document.querySelector('title')).toHaveTextContent(title);
      expect(
        document.querySelector('meta[name="description"]')
      ).toHaveAttribute('content', description);
      expect(document.querySelector('meta[name="image"]')).toHaveAttribute(
        'content',
        image
      );
      expect(document.querySelector('meta[property="og:url"]')).toHaveAttribute(
        'content',
        `localhost${url}`
      );
      expect(
        document.querySelector('meta[property="og:type"]')
      ).toHaveAttribute('content', 'website');
      expect(
        document.querySelector('meta[property="og:title"]')
      ).toHaveAttribute('content', title);
      expect(
        document.querySelector('meta[property="og:description"]')
      ).toHaveAttribute('content', description);
      expect(
        document.querySelector('meta[property="og:image"]')
      ).toHaveAttribute('content', image);
      expect(
        document.querySelector('meta[name="twitter:card"]')
      ).toHaveAttribute('content', 'summary_large_image');
      expect(
        document.querySelector('meta[name="twitter:title"]')
      ).toHaveAttribute('content', title);
      expect(
        document.querySelector('meta[name="twitter:description"]')
      ).toHaveAttribute('content', description);
      expect(
        document.querySelector('meta[name="twitter:image"]')
      ).toHaveAttribute('content', image);
    });
  });
});
