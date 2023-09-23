export interface IAvvyAPI {
  addressToDomain(address: string): Promise<string>;
  domainToAddress(domain: string): Promise<string>;
}
