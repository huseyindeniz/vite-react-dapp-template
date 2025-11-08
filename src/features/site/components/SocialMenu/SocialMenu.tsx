import React, { ReactNode } from 'react';

import { ActionIcon, Group, VisuallyHidden } from '@mantine/core';
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
    <ActionIcon
      component="a"
      href={href}
      target="_blank"
      variant="outline"
      radius="xl"
      size="md"
      aria-label={label}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </ActionIcon>
  );
};

export const SocialMenu: React.FC = React.memo(() => {
  return (
    <Group>
      <SocialButton
        label="GitHub"
        href="https://github.com/huseyindeniz/vite-react-dapp-template"
        key="GitHub"
      >
        <FaGithub />
      </SocialButton>
      <SocialButton
        label="Readme"
        href="https://huseyindeniz.github.io/react-dapp-template-documentation/"
        key="Documentation"
      >
        <FaReadme />
      </SocialButton>
    </Group>
  );
});
