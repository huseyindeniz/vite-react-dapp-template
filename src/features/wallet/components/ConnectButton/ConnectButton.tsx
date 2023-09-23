import { useDisclosure } from '@chakra-ui/react';
import React, { useEffect } from 'react';

import useTypedSelector from '../../../../hooks/useTypedSelector';
import { useActions } from '../../hooks/useActions';
import { LoadingStatusType } from '../../models/types/LoadingStatus';
import { WalletState } from '../../models/types/WalletState';
import { ConnectionModal } from '../ConnectionModal/ConnectionModal';

import { Button } from './Button/Button';

export const ConnectButton: React.FC = () => {
  const actions = useActions();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const loadingState = useTypedSelector(state => state.wallet.state.loading);
  const walletState = useTypedSelector(state => state.wallet.state.state);

  useEffect(() => {
    walletState !== undefined &&
    walletState !== WalletState.NOT_INITIALIZED &&
    walletState !== WalletState.AUTHENTICATED
      ? onOpen()
      : onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletState]);
  return (
    <>
      <Button
        isLoading={loadingState === LoadingStatusType.PENDING}
        onClick={actions.connectWallet}
      />
      {isOpen ? <ConnectionModal onDisconnect={onClose} /> : null}
    </>
  );
};
