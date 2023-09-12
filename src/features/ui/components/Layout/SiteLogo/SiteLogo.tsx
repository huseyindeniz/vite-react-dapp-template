import { Avatar, Box } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

import imageSiteLogo from '../../../assets/images/logo.webp';

export interface SiteLogoProps {
  siteName: string;
  baseUrl: string;
}
export const SiteLogo: React.FC<SiteLogoProps> = ({ siteName, baseUrl }) => {
  return (
    <Box>
      <Link to={baseUrl}>
        <Avatar src={imageSiteLogo} name={siteName} />
      </Link>
    </Box>
  );
};
