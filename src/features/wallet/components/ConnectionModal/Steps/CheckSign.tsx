import React from 'react';

import {
  Box,
  Button,
  Text,
  Progress,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { AlertMessage } from '@/features/ui/components/AlertMessage/AlertMessage';

import { DISABLE_WALLET_SIGN } from '../../../config';
import { AccountSignState } from '../../../models/account/types/AccountSignState';

export interface CheckSignProps {
  stepState: AccountSignState;
  errorMessage: string | null;
  signCounter: number;
  onSign: (message: string) => void;
  onDisconnect: () => void;
}

export const CheckSign: React.FC<CheckSignProps> = ({
  stepState,
  errorMessage,
  signCounter,
  onSign,
  onDisconnect,
}) => {
  const { t } = useTranslation('FeatureWallet');
  const signMessage = t('SIGN_MESSAGE');
  const NotSigned = () => {
    return (
      <AlertMessage status="warning" title={t('Sign Required')}>
        {t(
          'In order to use this app, you need to sign the login request in your wallet.'
        )}
        <SignButton />
      </AlertMessage>
    );
  };
  const SignRequested = () => {
    return (
      <AlertMessage status="info" title={t('Waiting Signature')}>
        <CircularProgress value={(100 * signCounter) / 60} color="blue.400">
          <CircularProgressLabel>{signCounter}s</CircularProgressLabel>
        </CircularProgress>
        <Text fontSize="xs">
          {t('Waiting for the login request to be signed.')}
          <br />
          {t('Please check your Metamask wallet.')}
        </Text>
      </AlertMessage>
    );
  };
  const SignRejected = () => {
    return (
      <AlertMessage status="warning" title={t('Sign Rejected')}>
        {t('You rejected the sign request.')}
        <br /> {t('Please try again if you want to continue.')}
        <SignButton />
      </AlertMessage>
    );
  };
  const SignTimedOut = () => {
    return (
      <AlertMessage status="warning" title={t('Sign Timed Out')}>
        {t("You didn't respond to the sign request in time.")}
        <br /> {t('Please try again if you want to continue.')}
        <SignButton />
      </AlertMessage>
    );
  };
  const SignFailed = () => {
    return (
      <AlertMessage status="warning" title={t('Unexpected Error')}>
        {t('An error has occured during the sign check.')}
        <br /> {t('Please try again later.')}
        <br />
        {t('The error code was')}: {errorMessage}
      </AlertMessage>
    );
  };
  const Signed = () => {
    return (
      <AlertMessage status="success" title={t('Signed In')}>
        {t('You have successfully signed the login request.')}
        <br />
        {t('Redirecting to app...')}
        <Progress size="xs" colorScheme="green" isIndeterminate />
      </AlertMessage>
    );
  };

  const WalletAccountLoaded = () => {
    return (
      <AlertMessage status="success" title={t('Load Account')}>
        {t('Your wallet account connected successfuly.')}
        <br />
        {t('Redirecting to app...')}
        <Progress size="xs" colorScheme="green" isIndeterminate />
      </AlertMessage>
    );
  };

  const SignButton = () => {
    return (
      <Box>
        <Button
          variant="solid"
          colorScheme="yellow"
          onClick={() => onSign(signMessage)}
        >
          {t('Sign In')}
        </Button>
        <Button ml={1} variant="solid" onClick={() => onDisconnect()}>
          {t('Cancel')}
        </Button>
      </Box>
    );
  };

  switch (stepState) {
    case AccountSignState.NOT_SIGNED:
      return <NotSigned />;
    case AccountSignState.SIGN_REQUESTED:
      return <SignRequested />;
    case AccountSignState.SIGN_REJECTED:
      return <SignRejected />;
    case AccountSignState.SIGN_TIMED_OUT:
      return <SignTimedOut />;
    case AccountSignState.SIGN_FAILED:
      return <SignFailed />;
    case AccountSignState.SIGNED:
      return DISABLE_WALLET_SIGN ? <WalletAccountLoaded /> : <Signed />;
    default:
      return null;
  }
};
