import React from 'react';

import { Modal as MantineModal, Stepper } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { FaFileSignature } from 'react-icons/fa';
import { GiChoice } from 'react-icons/gi';
import { IoMdUnlock } from 'react-icons/io';
import { MdAccountBalanceWallet, MdExtension } from 'react-icons/md';

import { DISABLE_WALLET_SIGN } from '../../../config';

export interface ModalProps {
  isOpen: boolean;
  activeStep: number;
  stepState?: 'loading' | 'error';
  checkWalletContent?: React.ReactNode;
  checkAccountContent?: React.ReactNode;
  checkNetworkContent?: React.ReactNode;
  checkSignContent?: React.ReactNode;
  onDisconnect: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  activeStep,
  stepState,
  checkWalletContent,
  checkAccountContent,
  checkNetworkContent,
  checkSignContent,
  onDisconnect,
}) => {
  const { t } = useTranslation('feature-wallet');
  const connectionSteps = (
    <Stepper active={activeStep} orientation="vertical">
      <Stepper.Step
        key="installation"
        label={t('Check Web3 Wallet Extension')}
        description={t(
          'A supported Web3 wallet extension needs to be installed.'
        )}
        icon={<MdExtension />}
        color={activeStep === 0 && stepState === 'error' ? 'red' : 'blue'}
        loading={activeStep === 0 && stepState === 'loading'}
      >
        {checkWalletContent}
      </Stepper.Step>
      <Stepper.Step
        key="unlock"
        label={t('Check Web3 Wallet Status')}
        description={t('The Web3 wallet needs to be unlocked.')}
        icon={<IoMdUnlock />}
        color={activeStep === 1 && stepState === 'error' ? 'red' : 'blue'}
        loading={activeStep === 1 && stepState === 'loading'}
      >
        {checkAccountContent}
      </Stepper.Step>
      <Stepper.Step
        key="network"
        label={t('Check Web3 Wallet Network')}
        description={t(
          'A supported network needs to be selected in the Web3 wallet.'
        )}
        icon={<GiChoice />}
        color={activeStep === 2 && stepState === 'error' ? 'red' : 'blue'}
        loading={
          activeStep === 2 && activeStep === 2 && stepState === 'loading'
        }
      >
        {checkNetworkContent}
      </Stepper.Step>
      <Stepper.Step
        key="signin"
        label={
          DISABLE_WALLET_SIGN
            ? t('Load Web3 Wallet Account')
            : t('Check Web3 Wallet Signature')
        }
        description={
          DISABLE_WALLET_SIGN
            ? ''
            : t('The login request needs to be signed in the Web3 wallet.')
        }
        icon={
          DISABLE_WALLET_SIGN ? <MdAccountBalanceWallet /> : <FaFileSignature />
        }
        color={activeStep === 3 && stepState === 'error' ? 'red' : 'blue'}
        loading={activeStep === 3 && stepState === 'loading'}
      >
        {checkSignContent}
      </Stepper.Step>
    </Stepper>
  );

  return (
    <MantineModal
      closeOnClickOutside={false}
      opened={isOpen}
      onClose={() => onDisconnect()}
      title={t('Connecting to Web3 Wallet')}
      size="lg"
    >
      {connectionSteps}
    </MantineModal>
  );
};
