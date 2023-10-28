import React from 'react';

import { useTranslation } from 'react-i18next';

import { AlertMessage } from '@/features/ui/components/AlertMessage/AlertMessage';

export interface SignFailedProps {
  errorMessage: string | null;
}
export const SignFailed: React.FC<SignFailedProps> = ({ errorMessage }) => {
  const { t } = useTranslation('FeatureWallet');
  return (
    <AlertMessage status="warning" title={t('Unexpected Error')}>
      {t('An error has occured during the sign check.')}
      <br />
      {t('Please try again later.')}
      <br />
      {t('The error code was:')} {errorMessage}
    </AlertMessage>
  );
};
