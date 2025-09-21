/// <reference types="vite/client" />

interface Window {
  ethereum: ExternalProvider;
  //web3: any;
  google?: {
    accounts?: {
      oauth2?: {
        initCodeClient: (config: any) => any;
      };
      id?: {
        initialize: (config: any) => void;
        prompt: (notification?: any) => void;
        renderButton: (parent: HTMLElement, options: any) => void;
        disableAutoSelect: () => void;
      };
    };
  };
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

declare const __VITE_REACT_DAPP_TEMPLATE_VERSION__: string;
