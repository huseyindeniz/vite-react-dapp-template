import React, { ReactNode } from 'react';

import {
  chakra,
  Stack,
  useColorModeValue,
  VisuallyHidden,
} from '@chakra-ui/react';
import { FaGithub, FaReadme } from 'react-icons/fa';

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <chakra.button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded="full"
      role="button"
      w={8}
      h={8}
      cursor="pointer"
      as="a"
      href={href}
      target="_blank"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      transition="background 0.3s ease"
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export const SocialMenu: React.FC = React.memo(() => {
  return (
    <Stack direction="row" spacing={6}>
      <SocialButton
        label="GitHub"
        href="https://github.com/huseyindeniz/vite-react-dapp-template"
        key="GitHub"
      >
        <FaGithub />
      </SocialButton>
      <SocialButton
        label="GitHub"
        href="https://huseyindeniz.github.io/react-dapp-template-documentation/"
        key="GitHub"
      >
        <FaReadme />
      </SocialButton>
    </Stack>
  );
});
