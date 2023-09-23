import { Box, Flex, IconButton, Tag } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MdRefresh } from 'react-icons/md';

import useTypedSelector from '../../../../hooks/useTypedSelector';
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNetwork]);

  return (
    <>
      {blockInfo ? (
        <Flex>
          <Box fontSize="xs" mr={1}>
            <Tag>
              {t('Block')}: {blockInfo.blockNumber}
            </Tag>
          </Box>
          <Box fontSize="xs" mr={1}>
            <Tag>
              {t('Balance')}
              {`: ${parseFloat(blockInfo.signerAccountBalance).toFixed(
                2
              )} ${currentNetwork?.nativeCurrency.symbol}`}
            </Tag>
          </Box>
          <IconButton
            isLoading={blockInfoLoading === LoadingStatusType.PENDING}
            icon={<MdRefresh />}
            variant="outline"
            size="xs"
            aria-label="refresh"
            onClick={() => actions.latestBlock()}
          />
        </Flex>
      ) : null}
    </>
  );
};
