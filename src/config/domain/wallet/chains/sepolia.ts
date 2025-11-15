import { Network } from '@/domain/features/wallet/models/network/types/Network';

export const SepoliaChain: Network = {
  chainId: 11155111,
  chainName: 'Sepolia',
  nativeCurrency: {
    name: 'Sepolia ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://ethereum-sepolia-rpc.publicnode.com'],
  blockExplorerUrls: ['https://sepolia.etherscan.io'],
  addressExplorerUrl: 'address',
  transactionExplorerUrl: 'tx',
  multicallAddress: '',
  isTestChain: true,
  isLocalChain: false,
};
