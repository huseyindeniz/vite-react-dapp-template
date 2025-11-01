import { AuthService } from '@/services/auth/AuthService';
import { GitHubAuthProvider } from '@/services/auth/providers/github/GitHubAuthProvider';
import { GoogleAuthProvider } from '@/services/auth/providers/google/GoogleAuthProvider';
import { EthersV6WalletAPI } from '@/services/ethersV6/wallet/WalletAPI';
import { BlogDemoApi } from '@/services/jsonplaceholder/BlogDemoApi';

export const walletApi = EthersV6WalletAPI.getInstance();
export const blogDemoApi = BlogDemoApi.getInstance();
export const authService = AuthService.getInstance();

// Register auth providers
authService.registerProvider(new GoogleAuthProvider());
authService.registerProvider(new GitHubAuthProvider());
