/**
 * Protection types available in the application
 * Used for page-level route protection only
 */
export enum ProtectionType {
  NONE = 'none',
  AUTH = 'auth',
  WALLET = 'wallet',
  BOTH = 'both',
}
