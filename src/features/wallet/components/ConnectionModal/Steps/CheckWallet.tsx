import { Box, Link, Image, VStack, Button, Text } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaExternalLinkAlt } from 'react-icons/fa';

import { AlertMessage } from '../../../../ui/components/AlertMessage/AlertMessage';
import imageMetamaskLogo from '../../../assets/images/mm-logo.webp';
import { ProviderLoadState } from '../../../models/provider/types/ProviderLoadState';

export interface CheckWalletProps {
  stepState: ProviderLoadState;
  onCancel: () => void;
}

export const CheckWallet: React.FC<CheckWalletProps> = ({
  stepState,
  onCancel,
}) => {
  const { t } = useTranslation('FeatureWallet');
  const isVisible: boolean =
    stepState === ProviderLoadState.FAILED ||
    stepState === ProviderLoadState.NOT_SUPPORTED;
  return isVisible ? (
    <AlertMessage status="warning" title={t('Metamask Is Not Detected')}>
      <VStack>
        <Image width="25%" src={imageMetamaskLogo} alt="Metamask" m={2} />
        <Text fontSize="xs">
          {t('The Metamask wallet extension is not detected in your browser.')}
          <br />
          {t(
            'In order to use this app, please install the Metamask extension for your browser from the official link below and try again.'
          )}
        </Text>
        <Box>
          <Button
            mr={1}
            size="xs"
            variant="solid"
            rightIcon={<FaExternalLinkAlt />}
            colorScheme="yellow"
          >
            <Link href="https://metamask.io/" isExternal>
              https://metamask.io/
            </Link>
          </Button>
          <Button
            size="xs"
            onClick={() => onCancel()}
            variant="solid"
            colorScheme="yellow"
          >
            {t('Cancel')}
          </Button>
        </Box>
      </VStack>
    </AlertMessage>
  ) : null;
};
