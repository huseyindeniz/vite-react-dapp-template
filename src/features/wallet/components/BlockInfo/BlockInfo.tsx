import React, { useEffect } from 'react';

import { Group, ActionIcon, Badge } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { MdRefresh } from 'react-icons/md';

import { useTypedSelector } from '@/hooks/useTypedSelector';

import { useActions } from '../../hooks/useActions';
import { LoadingStatusType } from '../../models/types/LoadingStatus';

export const BlockInfo: React.FC = () => {
  const { t } = useTranslation('FeatureWallet');
  const actions = useActions();
  const currentNetwork = useTypedSelector(
    state => state.wallet.network.network
  );
  const blockInfoLoading = useTypedSelector(
    state => state.wallet.network.blockInfoLoading
  );
  const blockInfo = useTypedSelector(state => state.wallet.network.blockInfo);

  useEffect(() => {
    if (currentNetwork) {
      actions.latestBlock();
      const interval = setInterval(() => {
        actions.latestBlock();
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [currentNetwork]);

  return (
    <>
      {blockInfo ? (
        <Group justify="flex-end" style={{ flex: 1 }}>
          <Badge color="gray.2" autoContrast>
            {t('Block')}: {blockInfo.blockNumber}
          </Badge>
          <Badge color="gray.2" autoContrast>
            {t('Balance')}
            {`: ${parseFloat(blockInfo.signerAccountBalance).toFixed(
              2
            )} ${currentNetwork?.nativeCurrency.symbol}`}
          </Badge>
          <ActionIcon
            loading={blockInfoLoading === LoadingStatusType.PENDING}
            variant="outline"
            size="xs"
            aria-label="refresh"
            onClick={() => actions.latestBlock()}
          >
            <MdRefresh />
          </ActionIcon>
        </Group>
      ) : null}
    </>
  );
};
