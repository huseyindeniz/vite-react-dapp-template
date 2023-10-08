import { BrowserProvider } from 'ethers/providers';
import log from 'loglevel';

import { ResolutionUtilsV2 } from './ResolutionUtilsV2/ResolutionUtilsV2';
import { ResolutionUtilsV2__factory } from './ResolutionUtilsV2/ResolutionUtilsV2__factory';

const resolutionUtilsV2Address = '0x1ea4e7A798557001b99D88D6b4ba7F7fc79406A9';

export class AvvyAPI {
  private static _instance: AvvyAPI | null = null;
  private resolutionUtilsV2: ResolutionUtilsV2;

  private constructor(provider: BrowserProvider) {
    this.resolutionUtilsV2 = ResolutionUtilsV2__factory.connect(
      resolutionUtilsV2Address,
      provider
    );
  }

  public static getInstance(provider: BrowserProvider): AvvyAPI {
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
