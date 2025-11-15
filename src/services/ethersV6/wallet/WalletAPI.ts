import { SignatureLike } from 'ethers/crypto';
import { verifyMessage } from 'ethers/hash';
import { BrowserProvider, Eip1193Provider, Network } from 'ethers/providers';
import { formatEther } from 'ethers/utils';
import log from 'loglevel';
import { eventChannel, EventChannel } from 'redux-saga';

import { SUPPORTED_NETWORKS } from '@/config/domain/wallet/config';
import { DISABLE_WALLET_SIGN } from '@/domain/features/wallet/config';
import { AccountType } from '@/domain/features/wallet/models/account/types/Account';
import { InstalledWallets } from '@/domain/features/wallet/models/provider/types/InstalledWallets';
import { SupportedWallets } from '@/domain/features/wallet/models/provider/types/SupportedWallets';

import { IWalletEthersV6ProviderApi } from '../interfaces/IWalletEthersV6ProviderApi';

import { MetamaskError } from './types/MetamaskError';
import { MetamaskRPCErrors } from './types/MetamaskRPCErrors';
import { WalletProvider } from './types/WalletProvider';

export class EthersV6WalletAPI implements IWalletEthersV6ProviderApi {
  private static _instance: IWalletEthersV6ProviderApi | null = null;
  private _isUnlocked: boolean = false;
  private _isSigned: boolean = false;
  private _signerAddress: string | null = null;
  private _provider: BrowserProvider | null = null;
  private _detectedWallets: InstalledWallets = {} as InstalledWallets;
  private _network: Network | null = null;
  private _accountChangeListener: EventChannel<string[]> | null = null;
  private _networkChangeListener: EventChannel<string> | null = null;
  private _accessToken: string | null = null;

  private constructor() {
    log.debug('ethers constructor private');
  }

  public static getInstance(): IWalletEthersV6ProviderApi {
    if (this._instance === null) {
      log.debug('ethers init');
      this._instance = new EthersV6WalletAPI();
    }
    return this._instance;
  }

  public detectWallets = async () => {
    this._detectedWallets = {} as InstalledWallets;
    if (window.ethereum) {
      log.debug('ethereum dedected', window.ethereum);
      if (window.ethereum.providers && window.ethereum.providers.length > 0) {
        log.debug('multiple provider dedected');
        window.ethereum.providers.map((p: Eip1193Provider) => {
          const detectedWallet = this._identifyWallet(p as WalletProvider);
          if (detectedWallet !== null) {
            this._detectedWallets[detectedWallet] = new BrowserProvider(p);
          }
          return null;
        });
      } else {
        log.debug('single provider dedected');
        const detectedWallet = this._identifyWallet(
          window.ethereum as WalletProvider
        );
        if (detectedWallet !== null) {
          this._detectedWallets[detectedWallet] = new BrowserProvider(
            window.ethereum
          );
        }
      }
    }
    log.debug(this._detectedWallets);
    return this._detectedWallets;
  };

  private _identifyWallet = (p: WalletProvider) => {
    if (p.coreProvider?.isAvalanche) {
      return SupportedWallets.CORE;
    }

    if (p.isCoinbaseWallet) {
      return SupportedWallets.COINBASE;
    }

    if (p.isRabby) {
      return SupportedWallets.RABBY;
    }

    if (p.isMetaMask) {
      return SupportedWallets.METAMASK;
    }
    return null;
  };

  public loadProvider = async (wallet: SupportedWallets) => {
    log.debug('load wallet', wallet);
    if (Object.keys(this._detectedWallets).includes(wallet)) {
      this._provider = this._detectedWallets[wallet];
    }
    return this._provider !== null;
  };

  public loadNetwork = async () => {
    this._network = (await this._provider?.getNetwork()) ?? null;
    const isSupported: boolean = await this._isNetworkSupported(null);
    if (!isSupported) {
      this._network = null;
    }
    return this.getNetwork();
  };

  public getNetwork = () => {
    return SUPPORTED_NETWORKS.find(
      chain => chain.chainId === Number(this._network?.chainId)
    );
  };

  public switchNetwork = async (networkId: number) => {
    const isSupported = this._isNetworkSupported(networkId);
    if (!isSupported) {
      return false;
    }
    await this._provider?.ready;
    log.debug(`0x${networkId.toString(16)}`);
    try {
      await this._provider?.send('wallet_switchEthereumChain', [
        { chainId: `0x${networkId.toString(16)}` },
      ]);
      return true;
    } catch {
      const networkDetails = SUPPORTED_NETWORKS.find(
        chain => chain.chainId === networkId
      );
      await this._provider?.send('wallet_addEthereumChain', [
        {
          chainId: `0x${networkId.toString(16)}`,
          rpcUrls: networkDetails?.rpcUrls,
          chainName: networkDetails?.chainName,
          nativeCurrency: networkDetails?.nativeCurrency,
          blockExplorerUrls: networkDetails?.blockExplorerUrls,
        },
      ]);
      return false;
    }
  };

  private _isNetworkSupported = async (chainId: number | null) => {
    if (chainId) {
      // check if chainId is in the supported list
      log.debug('isSupported for:', chainId);
      return SUPPORTED_NETWORKS.some(chain => chain.chainId === chainId);
    }
    log.debug('isNetworkSupported', this._network);
    return SUPPORTED_NETWORKS.some(
      chain => chain.chainId === Number(this._network?.chainId)
    );
  };

  public isUnlocked = async () => {
    const accounts: string[] = await this._provider?.send('eth_accounts', []);
    this._isUnlocked = accounts.length > 0;
    if (this._isUnlocked && DISABLE_WALLET_SIGN) {
      const address = await (await this._provider?.getSigner())?.getAddress();
      if (address) {
        this._signerAddress = address;
      }
    }
    return this._isUnlocked;
  };

  public unlock = async () => {
    const accounts: string[] = await this._provider?.send(
      'eth_requestAccounts',
      []
    );
    this._isUnlocked = accounts.length > 0;
    if (this._isUnlocked && DISABLE_WALLET_SIGN) {
      const address = await (await this._provider?.getSigner())?.getAddress();
      if (address) {
        this._signerAddress = address;
      }
    }
  };

  public isSigned = async () => {
    return this._isSigned;
  };

  public prepareSignMessage = async (message: string) => {
    const signer = await this._provider?.getSigner();
    if (!signer) {
      throw new Error('signer not dedected');
    }
    log.debug('signer', signer);
    const address: string = await signer?.getAddress();
    if (!address) {
      throw new Error('address not dedected');
    }
    this._accessToken = await this._newUUID(address);
    const messageWithToken = message + this._accessToken;

    /*
    const domain = window.location.host;
    const from = address;
    const siweMessage = `${domain} wants you to sign in with your Ethereum account:\n${from}\n\nI accept the MetaMask Terms of Service: https://community.metamask.io/tos\n\nURI: https://${domain}\nVersion: 1\nChain ID: 1\nNonce: 32891757\nIssued At: 2021-09-30T16:25:24.000Z`;
    */

    return messageWithToken;
  };

  public sign = async (message: string) => {
    const signer = await this._provider?.getSigner();
    if (!signer) {
      throw new Error('signer not dedected');
    }
    const address: string = await signer?.getAddress();
    let signature: string = '';
    try {
      signature = await signer.signMessage(message);
    } catch (error: unknown) {
      const metamaskError: MetamaskError = error as MetamaskError;
      if (metamaskError.code === MetamaskRPCErrors.ACTION_REJECTED) {
        throw new Error('sign_rejected');
      }
    }
    this._isSigned = await this._verifyLogingSignature(
      message,
      signature,
      address
    );
    if (this._isSigned) {
      this._signerAddress = address;
    }
  };

  public getSignerAddress = () => {
    return this._signerAddress;
  };

  public getProvider = () => {
    return this._provider;
  };

  // getAccount
  public getAccount = async () => {
    let result: AccountType | null = null;
    if (this._signerAddress) {
      result = {
        address: this._signerAddress,
        accessToken: this._accessToken,
        shortAddress: `${this._signerAddress.slice(
          0,
          6
        )}...${this._signerAddress.slice(-4)}`,
      };
    }
    return result;
  };

  // reset
  public reset = async () => {
    window.ethereum.removeAllListeners();
    this._isUnlocked = false;
    this._isSigned = false;
    this._signerAddress = null;
    this._network = null;
  };

  public listenAccountChange = (): EventChannel<string[]> | undefined => {
    if (this._accountChangeListener) {
      this._accountChangeListener.close();
      this._accountChangeListener = null;
    }
    this._accountChangeListener = eventChannel<string[]>(emit => {
      log.debug('listening for account changes');
      window.ethereum.addListener('accountsChanged', (accounts: string[]) => {
        emit(accounts);
      });

      return (): void => {
        log.debug('account listener closed');
        window.ethereum.removeListener('accountsChanged', emit);
      };
    });
    return this._accountChangeListener;
  };

  public listenNetworkChange = (): EventChannel<string> | undefined => {
    if (this._networkChangeListener) {
      this._networkChangeListener.close();
      this._networkChangeListener = null;
    }
    this._networkChangeListener = eventChannel<string>(emit => {
      log.debug('listening for network changes');
      window.ethereum.on('chainChanged', (chainId: string) => {
        emit(chainId);
      });

      return (): void => {
        log.debug('network listener closed');
        window.ethereum.removeListener('chainChanged', emit);
      };
    });
    return this._networkChangeListener;
  };

  public handleAccountChange = async () => {
    await this.reset();
  };

  public handleNetworkChange = async () => {
    await this.reset();
  };

  public getLatestBlock = async () => {
    log.debug('get latest block called');
    const blockNumber = await this._provider?.getBlockNumber();
    log.debug('block:', blockNumber);
    return blockNumber;
  };

  public getBalance = async () => {
    log.debug('get balance called');
    if (this._signerAddress) {
      const balance = await this._provider?.getBalance(this._signerAddress);
      if (balance) {
        return formatEther(balance);
      }
    }
    return '';
  };

  // this is a client side secret value for signing login
  // if you have a backend application
  // you could get this value from your backend
  private _newUUID = async (address: string) => {
    return address.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  // this is a client side verification for login signature
  // if you have backend, you could verify signature in your backend
  private _verifyLogingSignature = async (
    message: string,
    signature?: SignatureLike,
    address?: string
  ) => {
    if (signature && address) {
      const signerAddress: string = verifyMessage(message, signature);
      return signerAddress === address;
    }
    return false;
  };
}
