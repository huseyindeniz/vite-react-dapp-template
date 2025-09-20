/// <reference types="vite/client" />

interface Window {
  ethereum: ExternalProvider;
  //web3: any;
}

interface ImportMetaEnv {
  readonly VITE_ROUTER_USE_HASH?: 'true' | 'false';
  readonly VITE_WALLET_DISABLE_SIGN?: 'true' | 'false';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '@metamask/jazzicon' {
  export default function (diameter: number, seed: number): HTMLElement;
}
