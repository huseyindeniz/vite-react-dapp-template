import { Image } from '@chakra-ui/react';
import React from 'react';

import imageEthereumMainnet from '../../assets/images/chains/1.webp';
import imageGanache from '../../assets/images/chains/1337.webp';
import imagePolygon from '../../assets/images/chains/137.webp';
import imageHardhat from '../../assets/images/chains/31337.webp';
import imageAvalancheFuji from '../../assets/images/chains/43113.webp';
import imageAvalanche from '../../assets/images/chains/43114.webp';
import imageGoerli from '../../assets/images/chains/5.webp';
import imageBsc from '../../assets/images/chains/56.webp';
import imagePolygonMumbai from '../../assets/images/chains/80001.webp';
import imageBscTest from '../../assets/images/chains/97.webp';

export interface NetworkLogoProps {
  networkId: number;
  networkName: string;
  boxSize?: string;
}

const imagesNetwork: Record<number, string> = {
  43114: imageAvalanche,
  43113: imageAvalancheFuji,
  56: imageBsc,
  97: imageBscTest,
  1: imageEthereumMainnet,
  1337: imageGanache,
  5: imageGoerli,
  31337: imageHardhat,
  137: imagePolygon,
  80001: imagePolygonMumbai,
};

export const NetworkLogo: React.FC<NetworkLogoProps> = ({
  networkId,
  networkName,
  boxSize = '24px',
}) => {
  return (
    <Image
      boxSize={boxSize}
      objectFit="cover"
      src={imagesNetwork[networkId]}
      alt={networkName}
    />
  );
};
