import React from 'react';

import { Image } from '@mantine/core';

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
      w={boxSize}
      src={`assets/images/chains/${networkId}.webp`}
      alt={networkName}
    />
  );
};
