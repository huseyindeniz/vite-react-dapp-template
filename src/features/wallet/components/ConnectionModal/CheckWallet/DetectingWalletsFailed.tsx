import { useTranslation } from 'react-i18next';

import { AlertMessage } from '@/features/ui/components/AlertMessage/AlertMessage';

export const DetectingWalletsFailed = () => {
  const { t } = useTranslation('FeatureWallet');
  return (
    <AlertMessage status="warning" title={t('Detection Failed')}>
      {t('Web3 wallet detection failed.')}
    </AlertMessage>
  );
};
