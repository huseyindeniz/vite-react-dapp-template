/// <reference types="vite/client" />

interface Window {
  ethereum: ExternalProvider;
  //web3: any;
}

declare module "@metamask/jazzicon" {
  export default function (diameter: number, seed: number): HTMLElement;
}
