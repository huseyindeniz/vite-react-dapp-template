import React from 'react';

import { Image } from '@mantine/core';

import { SupportedWallets } from '@/features/wallet/models/provider/IProviderApi';

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
      w={boxSize}
      src={`assets/images/wallets/${wallet}.webp`}
      alt={label}
    />
  );
};
