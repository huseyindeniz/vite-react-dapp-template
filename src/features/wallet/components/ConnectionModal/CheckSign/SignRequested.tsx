import React from 'react';

import {
  Box,
  CircularProgress,
  CircularProgressLabel,
  VStack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { AlertMessage } from '@/features/ui/components/AlertMessage/AlertMessage';

export interface SignRequestedProps {
  signCounter: number;
}
export const SignRequested: React.FC<SignRequestedProps> = ({
  signCounter,
}) => {
  const { t } = useTranslation('FeatureWallet');
  return (
    <AlertMessage status="info" title={t('Waiting Signature')}>
      <VStack>
        <CircularProgress value={(100 * signCounter) / 60} color="blue.400">
          <CircularProgressLabel>{signCounter}s</CircularProgressLabel>
        </CircularProgress>
        <Box>
          {t('Waiting for the login request to be signed.')}
          <br />
          {t('Please check your Web3 wallet.')}
        </Box>
      </VStack>
    </AlertMessage>
  );
};
