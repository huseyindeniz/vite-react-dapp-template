import React from 'react';

import { useTranslation } from 'react-i18next';

import { AlertMessage } from '@/features/ui/components/AlertMessage/AlertMessage';

interface AccountDetectionFailedProps {
  errorMessage: string | null;
}
export const AccountDetectionFailed: React.FC<AccountDetectionFailedProps> = ({
  errorMessage,
}) => {
  const { t } = useTranslation('FeatureWallet');
  return (
    <AlertMessage status="warning" title={t('Unexpected Error')}>
      {t('An error has occured during the wallet status check.')}
      <br />
      {t('Please try again later.')}
      <br />
      {t('The error code was:')} {errorMessage}
    </AlertMessage>
  );
};
