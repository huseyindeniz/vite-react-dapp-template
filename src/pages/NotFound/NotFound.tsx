import {
  Title,
  Divider,
  Box,
  Container,
  Stack,
  Text,
  Image,
  Center,
  Anchor,
  Group,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { usePageLink } from '@/core/features/router/hooks/usePageLink';

import imageBackToHomePage from './assets/images/backToTheHomepage.webp';
import imageDelorean from './assets/images/delorean.webp';

export const NotFoundPage: React.FC = () => {
  const { t } = useTranslation('page-notfound');
  const { pageLink } = usePageLink();

  return (
    <Box>
      <Container maw="7xl" py={2} component={Stack}>
        <Title ta="center">{t('404 Page Not Found')}</Title>
        <Divider />
        <Center>
          <Stack
            bg="rgba(0, 0, 0, 0.8)"
            p={10}
            m={5}
            style={{ width: '70%' }}
            align="center"
          >
            <Image
              src={imageBackToHomePage}
              alt={t('404 Page Not Found')}
              style={{ width: '50%' }}
            />
            <Image
              src={imageDelorean}
              alt={t('404 Page Not Found')}
              style={{ width: '50%' }}
            />
          </Stack>
        </Center>
        <Center>
          <Stack ta="center">
            <Text>{t('Back to Home?')}</Text>
            <Group gap={4} justify="center">
              <Anchor
                component={RouterLink}
                to={pageLink('/')}
                p={2}
                m={2}
                style={{
                  border: '1px solid var(--mantine-color-blue-6)',
                  borderRadius: '4px',
                }}
              >
                {t('Yes')}
              </Anchor>
              <Anchor
                p={2}
                m={2}
                href="https://www.youtube.com/watch?v=M230r6CLZUA"
                style={{
                  border: '1px solid var(--mantine-color-blue-6)',
                  borderRadius: '4px',
                }}
              >
                {t('No')}
              </Anchor>
            </Group>
          </Stack>
        </Center>
      </Container>
    </Box>
  );
};
