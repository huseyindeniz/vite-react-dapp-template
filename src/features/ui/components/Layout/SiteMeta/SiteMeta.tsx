import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface SiteMetaProps {
  siteName: string;
  siteDescription: string;
}
export const SiteMeta: React.FC<SiteMetaProps> = ({
  siteName,
  siteDescription,
}) => {
  const PUBLIC_URL = window.location.host;
  return (
    <Helmet titleTemplate={`%s | ${siteName}`} defaultTitle={siteName}>
      <meta name="description" content={siteDescription} />
      <meta name="image" content={`${PUBLIC_URL}/default.png`} />

      <meta property="og:url" content={PUBLIC_URL} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={siteName} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={`${PUBLIC_URL}/default.png`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteName} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={`${PUBLIC_URL}/default.png`} />
    </Helmet>
  );
};
