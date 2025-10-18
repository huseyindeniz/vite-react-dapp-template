import { ProtectionType } from './ProtectionType';

export type MenuType = {
  path?: string;
  menuLabel: string | null;
  isShownInMainMenu?: boolean;
  isShownInSecondaryMenu?: boolean;
  protectionType?: ProtectionType;
};
