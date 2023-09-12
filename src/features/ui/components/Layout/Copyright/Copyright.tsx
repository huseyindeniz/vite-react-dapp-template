import { Box, Link, Button, Image, Tooltip } from '@chakra-ui/react';
import React from 'react';

// You can remove or change this section
export const Copyright: React.FC = React.memo(() => {
  return (
    <Box>
      <Tooltip label="Powered by Vite React dApp Template v0.0.1">
        <Button
          as={Link}
          href="https://github.com/huseyindeniz/Vite-React-dApp-Template"
          isExternal
          variant="ghost"
          size="xs"
          rightIcon={
            <Image
              height="20px"
              src="https://huseyindeniz.github.io/cra-template-dapp-documentation/img/logo.svg"
            />
          }
          color="gray"
          fontWeight="normal"
        >
          powered by
        </Button>
      </Tooltip>
    </Box>
  );
});
