import { Network } from '../models/network/types/Network';

export const AvalancheChain: Network = {
  chainId: 43114,
  chainName: 'Avalanche C-Chain',
  nativeCurrency: {
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18,
  },
  rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://avascan.info/blockchain/c'],
  addressExplorerUrl: 'address',
  transactionExplorerUrl: 'tx',
  multicallAddress: '',
  isTestChain: false,
  isLocalChain: false,
  isDomainNameSupported: true,
};
