import { Contract, ethers } from 'ethers';
import log from 'loglevel';

import { ResolutionUtilsV2 } from './ResolutionUtilsV2/ResolutionUtilsV2';
import { ResolutionUtilsV2__factory } from './ResolutionUtilsV2/ResolutionUtilsV2__factory';

const resolutionUtilsV2Address = '0x1ea4e7A798557001b99D88D6b4ba7F7fc79406A9';

export class AvvyAPI {
  private static _instance: AvvyAPI | null = null;
  private resolutionUtilsV2: ResolutionUtilsV2;

  private constructor(provider: ethers.providers.Web3Provider) {
    this.resolutionUtilsV2 = new Contract(
      resolutionUtilsV2Address,
      ResolutionUtilsV2__factory.abi,
      provider.getSigner()
    ) as ResolutionUtilsV2;
  }

  public static getInstance(provider: ethers.providers.Web3Provider): AvvyAPI {
    if (this._instance === null) {
      log.debug('AvvyAPI init');
      this._instance = new AvvyAPI(provider);
    }
    return this._instance;
  }

  public addressToDomain = async (address: string) => {
    const domain =
      await this.resolutionUtilsV2.reverseResolveEVMToName(address);
    log.debug(domain);
    return domain;
  };

  public domainToAddress = async (domain: string) => {
    const address = await this.resolutionUtilsV2.resolveStandard(domain, 3);
    log.debug(address);
    return address;
  };
}
