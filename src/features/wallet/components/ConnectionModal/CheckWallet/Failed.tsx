import React from 'react';

import { useTranslation } from 'react-i18next';

import { AlertMessage } from '@/features/ui/components/AlertMessage/AlertMessage';

interface FailedProps {
  errorMessage: string | null;
}
export const Failed: React.FC<FailedProps> = ({ errorMessage }) => {
  const { t } = useTranslation('FeatureWallet');
  return (
    <AlertMessage status="warning" title={t('Unexpected Error')}>
      {t('An error has occured during the wallet extension check.')}
      <br />
      {t('Please try again later.')}
      <br />
      {t('The error code was:')} {errorMessage}
    </AlertMessage>
  );
};
