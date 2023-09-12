import useTypedSelector from '../../../hooks/useTypedSelector';
import { WalletState } from '../models/types/WalletState';
export const useWalletAuthentication = () => {
  const walletState = useTypedSelector(state => state.wallet.state.state);
  const isAuthenticated = walletState === WalletState.AUTHENTICATED;

  return { isAuthenticated };
};
