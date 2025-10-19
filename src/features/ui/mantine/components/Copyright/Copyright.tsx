import React from 'react';

import { Button, Avatar, Tooltip } from '@mantine/core';

import reactDappTemplateLogo from '../../../assets/images/react-dapp-template-logo.webp';

// You can remove or change this section
export const Copyright: React.FC = React.memo(() => {
  return (
    <Tooltip
      label={`Powered by React dApp Template (Vite) v${__VITE_REACT_DAPP_TEMPLATE_VERSION__}`}
    >
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
