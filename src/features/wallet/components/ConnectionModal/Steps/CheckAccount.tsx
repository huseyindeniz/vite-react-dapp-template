import React from 'react';

import { Box, Button, Text, Progress } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { AlertMessage } from '@/features/ui/components/AlertMessage/AlertMessage';

import { AccountLoadState } from '../../../models/account/types/AccountLoadState';

export interface CheckAccountProps {
  stepState: AccountLoadState;
  errorMessage: string | null;
  onUnlock: () => void;
}

export const CheckAccount: React.FC<CheckAccountProps> = ({
  stepState,
  errorMessage,
  onUnlock,
}) => {
  const { t } = useTranslation('FeatureWallet');

  const AccountDetectionFailed = () => {
    return (
      <AlertMessage status="warning" title={t('Unexpected Error')}>
        <Text fontSize="xs">
          {t('An error has occured during the wallet status check.')}
          <br /> {t('Please try again later.')}
          <br />
          {t('The error code was')}: {errorMessage}
        </Text>
      </AlertMessage>
    );
  };

  const Locked = () => {
    return (
      <AlertMessage status="warning" title={t('Wallet Is Locked')}>
        <Text fontSize="xs">
          {t('Please unlock your wallet if you want to continue.')}
        </Text>
        <UnlockButton />
      </AlertMessage>
    );
  };

  const UnlockRequested = () => {
    return (
      <AlertMessage status="info" title={t('Unlock Requested')}>
        <Text fontSize="xs">
          {t('Waiting for the unlock wallet request to be accepted.')}
          <br />
          {t('Please check your Metamask wallet.')}
        </Text>
        <Progress size="xs" isIndeterminate colorScheme="blue" />
      </AlertMessage>
    );
  };

  const UnlockRejected = () => {
    return (
      <AlertMessage status="warning" title={t('Unlock Rejected')}>
        <Text fontSize="xs">
          {t('You rejected the unlock wallet request.')}
          <br />
          {t('Please try again if you want to continue.')}
        </Text>
        <UnlockButton />
      </AlertMessage>
    );
  };

  const UnlockWaiting = () => {
    return (
      <AlertMessage status="warning" title={t('Waiting Unlock')}>
        <Text fontSize="xs">
          {t("You haven't unlocked your wallet yet.")}
          <br />
          {t(
            'Please close this window, open your wallet, unlock it, and click connect button again.'
          )}
        </Text>
      </AlertMessage>
    );
  };

  const UnlockFailed = () => {
    return (
      <AlertMessage status="warning" title={t('Unexpected Error')}>
        <Text fontSize="xs">
          {t('An error has occured during the unlock wallet check.')}
          <br /> {t('Please try again later.')}
          <br />
          {t('The error code was')}: {errorMessage}
        </Text>
      </AlertMessage>
    );
  };

  const UnlockButton = () => {
    return (
      <Box>
        <Button variant="solid" colorScheme="yellow" onClick={() => onUnlock()}>
          {t('Unlock Wallet')}
        </Button>
      </Box>
    );
  };

  switch (stepState) {
    case AccountLoadState.ACCOUNT_DETECTION_FAILED:
      return <AccountDetectionFailed />;
    case AccountLoadState.LOCKED:
      return <Locked />;
    case AccountLoadState.UNLOCK_REQUESTED:
      return <UnlockRequested />;
    case AccountLoadState.UNLOCK_REJECTED:
      return <UnlockRejected />;
    case AccountLoadState.WAITING__UNLOCK:
      return <UnlockWaiting />;
    case AccountLoadState.UNLOCK_FAILED:
      return <UnlockFailed />;
    default:
      return null;
  }
};
