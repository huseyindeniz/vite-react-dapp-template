import { render, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

import { SiteMeta } from './SiteMeta';

describe('SiteMeta', () => {
  it('should render the component', async () => {
    const siteName = 'My Site';
    const siteDescription = 'This is my site';
    const image = 'localhost/default.png';
    const url = 'localhost';

    render(
      <HelmetProvider>
        <SiteMeta siteName={siteName} siteDescription={siteDescription} />
      </HelmetProvider>
    );
    await waitFor(() => {
      expect(document.title).toBe(siteName);

      expect(document.querySelector('title')).toHaveTextContent(siteName);
      expect(
        document.querySelector('meta[name="description"]')
      ).toHaveAttribute('content', siteDescription);
      expect(document.querySelector('meta[name="image"]')).toHaveAttribute(
        'content',
        image
      );
      expect(document.querySelector('meta[property="og:url"]')).toHaveAttribute(
        'content',
        url
      );
      expect(
        document.querySelector('meta[property="og:type"]')
      ).toHaveAttribute('content', 'website');
      expect(
        document.querySelector('meta[property="og:title"]')
      ).toHaveAttribute('content', siteName);
      expect(
        document.querySelector('meta[property="og:description"]')
      ).toHaveAttribute('content', siteDescription);
      expect(
        document.querySelector('meta[property="og:image"]')
      ).toHaveAttribute('content', image);
      expect(
        document.querySelector('meta[name="twitter:card"]')
      ).toHaveAttribute('content', 'summary_large_image');
      expect(
        document.querySelector('meta[name="twitter:title"]')
      ).toHaveAttribute('content', siteName);
      expect(
        document.querySelector('meta[name="twitter:description"]')
      ).toHaveAttribute('content', siteDescription);
      expect(
        document.querySelector('meta[name="twitter:image"]')
      ).toHaveAttribute('content', image);
    });
  });
});
