import {
  chakra,
  Stack,
  useColorModeValue,
  VisuallyHidden,
} from '@chakra-ui/react';
import React, { ReactNode } from 'react';

const FaGithub = React.lazy(() =>
  import('@react-icons/all-files/fa/FaGithub').then(module => ({
    default: module.FaGithub,
  }))
);
const FaLinkedin = React.lazy(() =>
  import('@react-icons/all-files/fa/FaLinkedin').then(module => ({
    default: module.FaLinkedin,
  }))
);

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

// Replace social links here

export const SocialMenu: React.FC = React.memo(() => {
  return (
    <Stack direction="row" spacing={6}>
      <SocialButton
        label="GitHub"
        href="https://github.com/huseyindeniz"
        key="GitHub"
      >
        <React.Suspense fallback="">
          <FaGithub />
        </React.Suspense>
      </SocialButton>
      <SocialButton
        label="Linkedin"
        href="https://linkedin.com/in/huseyindenizkivrak/en-us"
        key="Linkedin"
      >
        <React.Suspense fallback="">
          <FaLinkedin />
        </React.Suspense>
      </SocialButton>
    </Stack>
  );
});
