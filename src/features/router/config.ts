export const isHashRouter: boolean = JSON.parse(
  import.meta.env.VITE_ROUTER_USE_HASH || 'false'
);
