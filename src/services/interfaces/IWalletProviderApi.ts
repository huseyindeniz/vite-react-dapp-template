export interface IWalletProviderApi {
  loadProvider(): Promise<boolean>;
}
