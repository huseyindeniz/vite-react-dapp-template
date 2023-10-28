import React from 'react';

import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Divider,
  Box,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Spinner,
  Container,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FaFileSignature } from 'react-icons/fa';
import { GiChoice } from 'react-icons/gi';
import { IoMdUnlock } from 'react-icons/io';
import { MdAccountBalanceWallet, MdError, MdExtension } from 'react-icons/md';

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
  const { t } = useTranslation('FeatureWallet');

  const connectionSteps = (
    <Stepper index={activeStep} orientation="vertical" gap={4}>
      <Step key="installation" style={{ width: '100%' }}>
        <StepIndicator>
          <StepStatus
            complete={<StepIcon />}
            incomplete={<MdExtension />}
            active={
              stepState !== undefined ? (
                stepState === 'error' ? (
                  <Text color="darkred">
                    <MdError />
                  </Text>
                ) : (
                  <Spinner />
                )
              ) : (
                <MdExtension />
              )
            }
          />
        </StepIndicator>
        <Box w="full">
          <StepTitle>{t('Check Web3 Wallet Extension')}</StepTitle>
          <StepDescription>
            {t('A supported Web3 wallet extension needs to be installed.')}
          </StepDescription>
          <Container my={2} p={0}>
            {checkWalletContent}
          </Container>
        </Box>
        <StepSeparator />
      </Step>
      <Step key="unlock" style={{ width: '100%' }}>
        <StepIndicator>
          <StepStatus
            complete={<StepIcon />}
            incomplete={<IoMdUnlock />}
            active={
              stepState !== undefined ? (
                stepState === 'error' ? (
                  <Text color="darkred">
                    <MdError />
                  </Text>
                ) : (
                  <Spinner />
                )
              ) : (
                <IoMdUnlock />
              )
            }
          />
        </StepIndicator>
        <Box w="full">
          <StepTitle>{t('Check Web3 Wallet Status')}</StepTitle>
          <StepDescription>
            {t('The Web3 wallet needs to be unlocked.') as string}
          </StepDescription>
          <Container my={2} p={0}>
            {checkAccountContent}
          </Container>
        </Box>
        <StepSeparator />
      </Step>
      <Step key="network" style={{ width: '100%' }}>
        <StepIndicator>
          <StepStatus
            complete={<StepIcon />}
            incomplete={<GiChoice />}
            active={
              stepState !== undefined ? (
                stepState === 'error' ? (
                  <Text color="darkred">
                    <MdError />
                  </Text>
                ) : (
                  <Spinner />
                )
              ) : (
                <GiChoice />
              )
            }
          />
        </StepIndicator>
        <Box w="full">
          <StepTitle>{t('Check Web3 Wallet Network')}</StepTitle>
          <StepDescription>
            {
              t(
                'A supported network needs to be selected in the Web3 wallet.'
              ) as string
            }
          </StepDescription>
          <Container my={2} p={0} centerContent>
            {checkNetworkContent}
          </Container>
        </Box>
        <StepSeparator />
      </Step>
      <Step key="signin" style={{ width: '100%' }}>
        <StepIndicator>
          <StepStatus
            complete={<StepIcon />}
            incomplete={
              DISABLE_WALLET_SIGN ? (
                <MdAccountBalanceWallet />
              ) : (
                <FaFileSignature />
              )
            }
            active={
              stepState !== undefined ? (
                stepState === 'error' ? (
                  <Text color="darkred">
                    <MdError />
                  </Text>
                ) : (
                  <Spinner />
                )
              ) : DISABLE_WALLET_SIGN ? (
                <MdAccountBalanceWallet />
              ) : (
                <FaFileSignature />
              )
            }
          />
        </StepIndicator>
        <Box w="full">
          <StepTitle>
            {DISABLE_WALLET_SIGN
              ? t('Load Web3 Wallet Account')
              : t('Check Web3 Wallet Signature')}
          </StepTitle>
          <StepDescription>
            {DISABLE_WALLET_SIGN ??
              t('The login request needs to be signed in the Web3 wallet.')}
          </StepDescription>
          <Container my={2} p={0} centerContent>
            {checkSignContent}
          </Container>
        </Box>
        <StepSeparator />
      </Step>
    </Stepper>
  );

  return (
    <ChakraModal
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={() => onDisconnect()}
      preserveScrollBarGap={true}
    >
      <ModalOverlay />
      <ModalContent mx={4} maxWidth={{ base: '90%', md: '600px' }}>
        <ModalHeader>
          {t('Connecting to Web3 Wallet')}:
          <Divider mt={1} />
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody mb={3}>{connectionSteps}</ModalBody>
      </ModalContent>
    </ChakraModal>
  );
};
