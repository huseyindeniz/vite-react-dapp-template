/**
 * Protection types available in the application
 * Used for page-level route protection only
 */
export enum ProtectionType {
  NONE = 'none',
  OAUTH = 'oauth',
  WALLET = 'wallet',
  BOTH = 'both',
}
