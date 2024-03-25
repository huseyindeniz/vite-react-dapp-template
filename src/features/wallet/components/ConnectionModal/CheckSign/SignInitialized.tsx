import React from 'react';

import { Box, Progress, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { AlertMessage } from '@/features/ui/components/AlertMessage/AlertMessage';

export const SignInitialized: React.FC = () => {
  const { t } = useTranslation('FeatureWallet');
  return (
    <AlertMessage status="info" title={t('Preparing Sign Request')}>
      <VStack>
        <Box w="full">
          <Progress isIndeterminate color="blue.400" size={'lg'} />
        </Box>
      </VStack>
    </AlertMessage>
  );
};
