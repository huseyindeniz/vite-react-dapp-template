import React from 'react';

import {
  Badge,
  Button,
  Center,
  Container,
  Image,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { FaGithub } from 'react-icons/fa';

import { PageMeta } from '@/domain/layout/components/PageMeta/PageMeta';

import logo from './assets/images/logo.svg';
import classes from './Home.module.css';

export const HomePage: React.FC = () => {
  const { t } = useTranslation('page-home');
  const title: string = t('React dApp Template (Vite)');
  const description: string = t(
    'React dApp Template (Vite) is a Vite React template specifically designed for decentralized application (dApp) frontend development.'
  );

  return (
    <>
      <PageMeta title={title} description={description} url="" />
      <Container size={700}>
        <Stack ta="center" gap="lg" py={{ base: 60, md: 80 }}>
          <Center>
            <Image src={logo} className={classes.logo} w={100} />
          </Center>

          <Title
            order={1}
            style={{
              fontSize: '48px',
              fontWeight: 800,
              lineHeight: 1.2,
            }}
          >
            Build Modern{' '}
            <Text
              component="span"
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan' }}
              inherit
            >
              Web, dApp & AI Assistant
            </Text>{' '}
            User Interfaces
          </Title>

          <Text size="lg" c="dimmed">
            A production-ready React template for building modern web
            applications, decentralized apps, and AI assistant interfaces with
            best practices and scalable architecture
          </Text>

          <Center>
            <Badge
              size="lg"
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan' }}
              radius="md"
            >
              {t('Edit {{path}} and save to reload.', {
                path: 'src/pages/Home/Home.tsx',
                interpolation: { escapeValue: false },
              })}
            </Badge>
          </Center>

          <Center>
            <Button
              size="lg"
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan' }}
              radius="md"
              component="a"
              href="https://github.com/huseyindeniz/vite-react-dapp-template"
              target="_blank"
              rel="noopener noreferrer"
              leftSection={<FaGithub size={20} />}
            >
              View on GitHub
            </Button>
          </Center>
        </Stack>
      </Container>
    </>
  );
};
