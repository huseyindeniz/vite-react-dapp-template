import { Avatar, Box } from '@mantine/core';
import { Link } from 'react-router-dom';

import imageSiteLogo from '@/config/ui/assets/images/site-logo.webp';

export interface SiteLogoProps {
  siteName: string;
  baseUrl: string;
}

export const SiteLogo: React.FC<SiteLogoProps> = ({ siteName, baseUrl }) => {
  return (
    <Box>
      <Link to={baseUrl}>
        <Avatar src={imageSiteLogo} alt={siteName} />
      </Link>
    </Box>
  );
};
