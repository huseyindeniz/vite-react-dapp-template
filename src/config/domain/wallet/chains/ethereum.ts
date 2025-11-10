import { Network } from '@/domain/features/wallet/models/network/types/Network';

export const EthereumMainnetChain: Network = {
  chainId: 1,
  chainName: 'Ethereum Mainnet',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://mainnet.infura.io/v3/'],
  blockExplorerUrls: ['https://etherscan.io'],
  addressExplorerUrl: 'address',
  transactionExplorerUrl: 'tx',
  multicallAddress: '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
  isTestChain: false,
  isLocalChain: false,
};
