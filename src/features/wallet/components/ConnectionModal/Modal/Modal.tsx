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
} from '@chakra-ui/react';
import { FaFileSignature } from '@react-icons/all-files/fa/FaFileSignature';
import { GiChoice } from '@react-icons/all-files/gi/GiChoice';
import { IoMdUnlock } from '@react-icons/all-files/io/IoMdUnlock';
import { MdAccountBalanceWallet } from '@react-icons/all-files/md/MdAccountBalanceWallet';
import { MdError } from '@react-icons/all-files/md/MdError';
import { MdExtension } from '@react-icons/all-files/md/MdExtension';
import React from 'react';
import { useTranslation } from 'react-i18next';

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
    <Stepper index={activeStep} orientation="vertical" gap={'40px'}>
      <Step key="installation">
        <StepIndicator>
          <StepStatus
            complete={<StepIcon />}
            incomplete={<MdExtension />}
            active={
              stepState !== undefined ? (
                stepState === 'error' ? (
                  <MdError />
                ) : (
                  <Spinner />
                )
              ) : (
                <MdExtension />
              )
            }
          />
        </StepIndicator>
        <Box>
          <StepTitle>{t('Check Metamask Extension')}</StepTitle>
          <StepDescription>
            {
              t(
                'The Metamask wallet extension needs to be installed.'
              ) as string
            }
          </StepDescription>
          <Container my={2} p={0} centerContent>
            {checkWalletContent}
          </Container>
        </Box>
        <StepSeparator />
      </Step>
      <Step key="unlock">
        <StepIndicator>
          <StepStatus
            complete={<StepIcon />}
            incomplete={<IoMdUnlock />}
            active={
              stepState !== undefined ? (
                stepState === 'error' ? (
                  <MdError />
                ) : (
                  <Spinner />
                )
              ) : (
                <IoMdUnlock />
              )
            }
          />
        </StepIndicator>
        <Box>
          <StepTitle>{t('Check Metamask Status')}</StepTitle>
          <StepDescription>
            {t('The Metamask wallet needs to be unlocked.') as string}
          </StepDescription>
          <Container my={2} p={0} centerContent>
            {checkAccountContent}
          </Container>
        </Box>
        <StepSeparator />
      </Step>
      <Step key="network">
        <StepIndicator>
          <StepStatus
            complete={<StepIcon />}
            incomplete={<GiChoice />}
            active={
              stepState !== undefined ? (
                stepState === 'error' ? (
                  <MdError />
                ) : (
                  <Spinner />
                )
              ) : (
                <GiChoice />
              )
            }
          />
        </StepIndicator>
        <Box>
          <StepTitle>{t('Check Metamask Network')}</StepTitle>
          <StepDescription>
            {
              t(
                'A supported network needs to be selected in the Metamask wallet.'
              ) as string
            }
          </StepDescription>
          <Container my={2} p={0} centerContent>
            {checkNetworkContent}
          </Container>
        </Box>
        <StepSeparator />
      </Step>
      <Step key="signin">
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
                  <MdError />
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
        <Box>
          <StepTitle>
            {DISABLE_WALLET_SIGN
              ? t('Load Wallet Account')
              : t('Check Metamask Signature')}
          </StepTitle>
          <StepDescription>
            {DISABLE_WALLET_SIGN ??
              t('The login request needs to be signed in the Metamask wallet.')}
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
          {t('Connecting to Metamask')}:
          <Divider mt={1} />
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody mb={3}>{connectionSteps}</ModalBody>
      </ModalContent>
    </ChakraModal>
  );
};
