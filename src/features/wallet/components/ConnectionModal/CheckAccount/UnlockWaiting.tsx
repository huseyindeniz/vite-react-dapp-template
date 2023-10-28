import { useTranslation } from 'react-i18next';

import { AlertMessage } from '@/features/ui/components/AlertMessage/AlertMessage';

export const UnlockWaiting = () => {
  const { t } = useTranslation('FeatureWallet');
  return (
    <AlertMessage status="warning" title={t('Waiting Unlock')}>
      {t("You haven't unlocked your wallet yet.")}
      <br />
      {t(
        'Please close this dialog, open your Web3 wallet, unlock it, and click connect button again.'
      )}
    </AlertMessage>
  );
};
