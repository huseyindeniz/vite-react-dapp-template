import React from 'react';

import { useTranslation } from 'react-i18next';

import { AlertMessage } from '@/features/ui/components/AlertMessage/AlertMessage';

interface UnlockFailedProps {
  errorMessage: string | null;
}
export const UnlockFailed: React.FC<UnlockFailedProps> = ({ errorMessage }) => {
  const { t } = useTranslation('FeatureWallet');
  return (
    <AlertMessage status="warning" title={t('Unexpected Error')}>
      {t('An error has occured during the unlock wallet check.')}
      <br />
      {t('Please try again later.')}
      <br />
      {t('The error code was:')} {errorMessage}
    </AlertMessage>
  );
};
