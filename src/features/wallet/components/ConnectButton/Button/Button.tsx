import { Button as ChakraButton } from '@chakra-ui/react';
import { FaWallet } from '@react-icons/all-files/fa/FaWallet';
import React from 'react';
import { useTranslation } from 'react-i18next';

export interface ButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export const Button: React.FC<ButtonProps> = ({ onClick, isLoading }) => {
  const { t } = useTranslation('FeatureWallet');
  return (
    <ChakraButton
      ml={2}
      variant="solid"
      isLoading={isLoading}
      colorScheme="yellow"
      leftIcon={<FaWallet />}
      onClick={() => onClick()}
      role="button"
    >
      {t('Connect')}
    </ChakraButton>
  );
};
