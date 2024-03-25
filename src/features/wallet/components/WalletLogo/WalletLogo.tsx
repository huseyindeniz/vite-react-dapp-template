import React from 'react';

import { Image } from '@chakra-ui/react';

import { SupportedWallets } from '@/services/interfaces/IWalletProviderApi';

export interface WalletLogoProps {
  wallet: SupportedWallets;
  label: string;
  boxSize?: string;
}

export const WalletLogo: React.FC<WalletLogoProps> = ({
  wallet,
  label,
  boxSize = '24px',
}) => {
  return (
    <Image
      boxSize={boxSize}
      objectFit="cover"
      src={`assets/images/wallets/${wallet}.webp`}
      alt={label}
    />
  );
};
