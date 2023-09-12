import {
  Heading,
  Divider,
  Box,
  Container,
  Stack,
  Text,
  Image,
  VStack,
  Center,
  Link,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { usePageLink } from '../usePageLink';

import imageBackToHomePage from './assets/images/backToTheHomepage.webp';
import imageDelorean from './assets/images/delorean.webp';

export const NotFoundPage: React.FC = () => {
  const { t } = useTranslation('PageNotFound');
  const { pageLink } = usePageLink();

  return (
    <Box>
      <Container maxW="7xl" py={2} as={Stack} spacing={12}>
        <Stack spacing={0} align="center">
          <Heading>{t('404 Page Not Found')}</Heading>
          <Divider />
        </Stack>
        <Center>
          <VStack bgColor="blackAlpha.800">
            <Image
              width="50%"
              src={imageBackToHomePage}
              alt="not found"
              m={2}
            />
            <Image width="50%" src={imageDelorean} alt="not found" m={2} />
          </VStack>
        </Center>
        <Center>
          <VStack>
            <Text>{t('Back To Home?')}</Text>
            <Box>
              <Link
                as={RouterLink}
                to={pageLink('/')}
                border="1px"
                borderColor="gray.200"
                borderRadius="md"
                p={1}
                m={1}
              >
                {t('Yes')}
              </Link>
              <Link
                border="1px"
                borderColor="gray.200"
                borderRadius="md"
                p={1}
                m={1}
                href="https://www.youtube.com/watch?v=M230r6CLZUA"
              >
                {t('No')}
              </Link>
            </Box>
          </VStack>
        </Center>
      </Container>
    </Box>
  );
};
