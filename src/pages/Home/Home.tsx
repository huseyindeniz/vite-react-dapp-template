import React from 'react';

import {
  Container,
  Stack,
  Title,
  Text,
  Image,
  Center,
  Anchor,
  Badge,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { FaExternalLinkAlt } from 'react-icons/fa';

import { PageMeta } from '@/features/components/PageMeta/PageMeta';

import logo from './assets/images/logo.svg';

export const HomePage: React.FC = () => {
  const { t } = useTranslation('page-home');
  const title: string = t('React dApp Template (Vite)');
  const description: string = t(
    'React dApp Template (Vite) is a Vite React template specifically designed for decentralized application (dApp) frontend development.'
  );
  return (
    <>
      <style>
        {`         
          @media (prefers-reduced-motion: no-preference) {
            .App-logo {
              animation: App-logo-spin infinite 20s linear;
            }
          }
          @keyframes App-logo-spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
      `}
      </style>
      <PageMeta title={title} description={description} url="" />
      <Container maw="3xl">
        <Stack ta="center" py={{ base: 10, md: 16 }}>
          <Center>
            <Image src={logo} className="App-logo" w={100} />
          </Center>
          <Title
            fw={600}
            fs={{ base: '1xl', sm: '2xl', md: '3xl' }}
            ta="center"
          >
            {t('experience the full power of React for dApp development')}
            <br />
            <Text component="span" c="blue">
              {title}
            </Text>
          </Title>
          <Text>{description}</Text>
          <Center>
            <Badge size="lg" color="orange.2" radius="sm" autoContrast>
              {t('Edit {{path}} and save to reload.', {
                path: 'src/pages/Home/Home.tsx',
                interpolation: { escapeValue: false },
              })}
            </Badge>
          </Center>
          <Stack gap={6}>
            <Anchor
              href="https://reactjs.org"
              rel="noopener noreferrer"
              target="_blank"
              variant="default"
              size="xs"
            >
              {t('Learn React')}&nbsp;
              <FaExternalLinkAlt />
            </Anchor>
            <Anchor
              href="https://github.com/huseyindeniz/vite-react-dapp-template"
              rel="noopener noreferrer"
              target="_blank"
              variant="default"
              size="xs"
            >
              {t('Learn React dApp Template (Vite)')}&nbsp;
              <FaExternalLinkAlt />
            </Anchor>
          </Stack>
        </Stack>
      </Container>
    </>
  );
};
