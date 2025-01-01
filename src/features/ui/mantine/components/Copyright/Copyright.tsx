import React from 'react';

import { Button, Avatar, Tooltip } from '@mantine/core';

import reactDappTemplateLogo from '../../../assets/images/react-dapp-template-logo.webp';

// You can remove or change this section
export const Copyright: React.FC = React.memo(() => {
  return (
    <Tooltip label="Powered by React dApp Template (Vite) v0.6.1">
      <Button
        component="a"
        href="https://github.com/huseyindeniz/vite-react-dapp-template"
        variant="transparent"
        size="sm"
        target="_blank"
        rightSection={<Avatar size="xs" src={reactDappTemplateLogo} />}
      >
        powered by
      </Button>
    </Tooltip>
  );
});
