import React from 'react';

import {
  Box,
  Container,
  Stack,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react';

export interface FooterViewProps {
  firstRowContent?: React.ReactNode;
  secondRowContent?: React.ReactNode;
}

export const FooterView: React.FC<FooterViewProps> = ({
  firstRowContent,
  secondRowContent,
}) => {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
    >
      {firstRowContent ? (
        <>
          <Container
            as={Stack}
            maxW="6xl"
            py={4}
            spacing={4}
            justify="center"
            align="center"
          >
            {firstRowContent}
          </Container>
          <Divider />
        </>
      ) : null}
      {secondRowContent ? (
        <Container
          as={Stack}
          maxW="6xl"
          py={4}
          direction={{ base: 'column', md: 'row' }}
          spacing={4}
          justify={{ base: 'center', md: 'space-between' }}
          align={{ base: 'center', md: 'center' }}
        >
          {secondRowContent}
        </Container>
      ) : null}
    </Box>
  );
};
