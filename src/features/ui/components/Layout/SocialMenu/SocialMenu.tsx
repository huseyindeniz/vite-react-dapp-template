import React, { ReactNode } from 'react';

import {
  chakra,
  Stack,
  useColorModeValue,
  VisuallyHidden,
  Spinner,
} from '@chakra-ui/react';
import { FaTwitter, FaDiscord, FaInstagram } from 'react-icons/fa';

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
        label="Twitter"
        href="https://twitter.com/randora_avax_sh"
        key="Twitter"
      >
        <React.Suspense fallback={<Spinner size={'xs'} />}>
          <FaTwitter />
        </React.Suspense>
      </SocialButton>
      <SocialButton
        label="Discord"
        href="https://discord.gg/qx7YM3NAkR"
        key="Discord"
      >
        <React.Suspense fallback={<Spinner size={'xs'} />}>
          <FaDiscord />
        </React.Suspense>
      </SocialButton>
      <SocialButton
        label="Instagram"
        href="https://www.instagram.com/randora_avax_sh/"
        key="Instagram"
      >
        <React.Suspense fallback={<Spinner size={'xs'} />}>
          <FaInstagram />
        </React.Suspense>
      </SocialButton>
    </Stack>
  );
});
