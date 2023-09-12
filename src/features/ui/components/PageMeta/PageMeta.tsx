import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface PageMetaProps {
  title: string;
  url: string;
  description: string;
  image?: string;
}
export const PageMeta: React.FC<PageMetaProps> = ({
  title,
  url,
  description,
  image,
}) => {
  const PUBLIC_URL = window.location.host;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="image" content={image ?? `${PUBLIC_URL}/default.png`} />

      <meta property="og:url" content={`${PUBLIC_URL}${url}`} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta
        property="og:image"
        content={image ?? `${PUBLIC_URL}/default.png`}
      />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta
        name="twitter:image"
        content={image ?? `${PUBLIC_URL}/default.png`}
      />
    </Helmet>
  );
};
