import { Network } from '@/domain/features/wallet/models/network/types/Network';

export const PolygonChain: Network = {
  chainId: 137,
  chainName: 'Polygon Mainnet',
  nativeCurrency: {
    name: 'Polygon',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: ['https://polygon-rpc.com/'],
  blockExplorerUrls: ['https://polygonscan.com'],
  addressExplorerUrl: 'address',
  transactionExplorerUrl: 'tx',
  multicallAddress: '',
  isTestChain: false,
  isLocalChain: false,
};
