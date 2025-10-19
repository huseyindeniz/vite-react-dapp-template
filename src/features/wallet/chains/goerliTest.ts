import { Network } from '../models/network/types/Network';

export const GoerliTestChain: Network = {
  chainId: 5,
  chainName: 'Goerli',
  nativeCurrency: {
    name: 'GoerliETH',
    symbol: 'GoerliETH',
    decimals: 18,
  },
  rpcUrls: ['https://goerli.infura.io/v3/'],
  blockExplorerUrls: ['https://goerli.etherscan.io'],
  addressExplorerUrl: 'address',
  transactionExplorerUrl: 'tx',
  multicallAddress: '',
  isTestChain: true,
  isLocalChain: false,
};
