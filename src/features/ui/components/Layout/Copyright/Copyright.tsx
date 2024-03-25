import React from 'react';

import { Box, Link, Button, Image, Tooltip } from '@chakra-ui/react';

import reactDappTemplateLogo from '../../../assets/images/react-dapp-template-logo.webp';

// You can remove or change this section
export const Copyright: React.FC = React.memo(() => {
  return (
    <Box>
      <Tooltip label="Powered by React dApp Template (Vite) v0.5.5">
        <Button
          as={Link}
          href="https://github.com/huseyindeniz/vite-react-dapp-template"
          isExternal
          variant="ghost"
          size="xs"
          rightIcon={<Image height="20px" src={reactDappTemplateLogo} />}
          color="gray"
          fontWeight="normal"
        >
          powered by
        </Button>
      </Tooltip>
    </Box>
  );
});
