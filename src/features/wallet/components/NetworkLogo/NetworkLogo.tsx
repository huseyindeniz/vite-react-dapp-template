import React from 'react';

import { Image } from '@chakra-ui/react';

export interface NetworkLogoProps {
  networkId: number;
  networkName: string;
  boxSize?: string;
}

export const NetworkLogo: React.FC<NetworkLogoProps> = ({
  networkId,
  networkName,
  boxSize = '24px',
}) => {
  return (
    <Image
      boxSize={boxSize}
      objectFit="cover"
      src={`assets/images/chains/${networkId}.webp`}
      alt={networkName}
    />
  );
};
