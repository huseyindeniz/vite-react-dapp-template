import React, { useEffect } from 'react';

import { useDisclosure } from '@mantine/hooks';

import useTypedSelector from '@/hooks/useTypedSelector';

import { useActions } from '../../hooks/useActions';
import { LoadingStatusType } from '../../models/types/LoadingStatus';
import { WalletState } from '../../models/types/WalletState';
import { ConnectionModal } from '../ConnectionModal/ConnectionModal';

import { Button } from './Button/Button';

export const ConnectButton: React.FC = () => {
  const actions = useActions();
  const [opened, { open, close }] = useDisclosure();
  const loadingState = useTypedSelector(state => state.wallet.state.loading);
  const walletState = useTypedSelector(state => state.wallet.state.state);

  useEffect(() => {
    walletState !== undefined &&
    walletState !== WalletState.NOT_INITIALIZED &&
    walletState !== WalletState.AUTHENTICATED
      ? open()
      : close();
  }, [walletState]);
  return (
    <>
      <Button
        isLoading={loadingState === LoadingStatusType.PENDING}
        onClick={actions.connectWallet}
      />
      {opened ? <ConnectionModal onDisconnect={close} /> : null}
    </>
  );
};
