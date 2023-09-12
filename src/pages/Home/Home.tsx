import {
  Container,
  Stack,
  Box,
  Heading,
  Text,
  Button,
  Link,
  Tag,
  Image,
} from '@chakra-ui/react';
import { FaExternalLinkAlt } from '@react-icons/all-files/fa/FaExternalLinkAlt';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { PageMeta } from '../../features/ui/components/PageMeta/PageMeta';

import logo from './assets/images/logo.svg';

export const HomePage: React.FC = () => {
  const { t } = useTranslation('PageHome');
  const title: string = t('Vite React dApp Template');
  const description: string = t(
    'Vite React dApp Template is a Vite React template specifically designed for decentralized application (dApp) frontend development.'
  );
  return (
    <>
      <style>
        {`
          .App-logo {
            height: 20vmin;
            pointer-events: none;
          }
          
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
      <Container maxW="3xl">
        <Stack
          as={Box}
          textAlign="center"
          spacing={{ base: 2, md: 4 }}
          py={{ base: 10, md: 16 }}
        >
          <Image src={logo} className="App-logo" />
          <Heading
            fontWeight={600}
            fontSize={{ base: '1xl', sm: '2xl', md: '3xl' }}
            lineHeight="110%"
            textAlign="center"
          >
            {t('experience the full power of React for dApp development')}
            <br />
            <Text as="span" color="blue.400">
              {title}
            </Text>
          </Heading>
          <Text>{description}</Text>
          <Text>
            <Tag size="lg" colorScheme="orange">
              {t('Edit {{path}} and save to reload.', {
                path: 'src/pages/Home/Home.tsx',
                interpolation: { escapeValue: false },
              })}
            </Tag>
          </Text>
          <Stack
            direction="column"
            spacing={3}
            align="center"
            alignSelf="center"
            position="relative"
          >
            <Button
              as={Link}
              href="https://reactjs.org"
              rel="noopener noreferrer"
              isExternal
              variant="ghost"
              size="xs"
              rightIcon={<FaExternalLinkAlt />}
            >
              {t('Learn React')}
            </Button>
            <Button
              as={Link}
              href="https://github.com/huseyindeniz/Vite-React-dApp-Template"
              rel="noopener noreferrer"
              isExternal
              variant="ghost"
              size="xs"
              rightIcon={<FaExternalLinkAlt />}
            >
              {t('Learn Vite React dApp Template')}
            </Button>
          </Stack>
        </Stack>
      </Container>
    </>
  );
};
