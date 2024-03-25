import { AvalancheChain } from './chains/avalanche';
import { AvalancheTestChain } from './chains/avalancheTest';
import { BinanceSmartChain } from './chains/bsc';
import { BSCTestChain } from './chains/bscTest';
import { EthereumMainnetChain } from './chains/ethereum';
import { GanacheChain } from './chains/ganache';
import { GoerliTestChain } from './chains/goerliTest';
import { HardhatChain } from './chains/hardhat';
import { PolygonChain } from './chains/polygon';
import { PolygonMumbaiChain } from './chains/polygonMumbai';
import { SepoliaChain } from './chains/sepolia';
import { Network } from './models/network/types/Network';
import { Web3Wallet } from './models/provider/types/Web3Wallet';
import { Coinbase } from './web3Wallets/coinbase';
import { Core } from './web3Wallets/core';
import { Metamask } from './web3Wallets/metamask';

export const SUPPORTED_NETWORKS: Network[] = [
  AvalancheChain,
  BinanceSmartChain,
  PolygonChain,
  EthereumMainnetChain,
  AvalancheTestChain,
  BSCTestChain,
  PolygonMumbaiChain,
  GoerliTestChain,
  GanacheChain,
  SepoliaChain,
  HardhatChain,
];
export const DEFAULT_NETWORK = AvalancheChain;

export const SUPPORTED_WALLETS: Web3Wallet[] = [Metamask, Core, Coinbase];

export const SIGN_TIMEOUT_IN_SEC = 60;
export const SLOW_DOWN_IN_MS = 1000;
export const DISABLE_WALLET_SIGN = true;
