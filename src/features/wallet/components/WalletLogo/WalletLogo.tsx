import React from 'react';

import { Image } from '@chakra-ui/react';

import { SupportedWallets } from '@/services/interfaces/IWalletProviderApi';

import coinbaseLogo from '../../assets/images/wallets/coinbase.webp';
import coreLogo from '../../assets/images/wallets/core.webp';
import metamaskLogo from '../../assets/images/wallets/metamask.webp';

export interface WalletLogoProps {
  wallet: SupportedWallets;
  label: string;
  boxSize?: string;
}

const imagesWallet: Record<SupportedWallets, string> = {
  metamask: metamaskLogo,
  core: coreLogo,
  coinbase: coinbaseLogo,
};

export const WalletLogo: React.FC<WalletLogoProps> = ({
  wallet,
  label,
  boxSize = '24px',
}) => {
  return (
    <Image
      boxSize={boxSize}
      objectFit="cover"
      src={imagesWallet[wallet]}
      alt={label}
    />
  );
};
