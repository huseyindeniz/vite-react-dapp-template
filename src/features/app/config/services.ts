import { ChatService } from '@/services/chat/ChatService';
import { GoogleADKChatModelAdapter } from '@/services/chat/GoogleADKChatModelAdapter';
import { LangGraphChatModelAdapter } from '@/services/chat/LangGraphChatModelAdapter';
import { EthersV6WalletAPI } from '@/services/ethersV6/wallet/WalletAPI';
import { BlogDemoApi } from '@/services/jsonplaceholder/BlogDemoApi';
import { OAuthService } from '@/services/oauth/OAuthService';
import { GitHubOAuthProvider } from '@/services/oauth/providers/github/GitHubOAuthProvider';
import { GoogleOAuthProvider } from '@/services/oauth/providers/google/GoogleOAuthProvider';

export const walletApi = EthersV6WalletAPI.getInstance();
export const blogDemoApi = BlogDemoApi.getInstance();
export const oauthService = OAuthService.getInstance();
export const chatService = ChatService.getInstance();

// Register OAuth providers
oauthService.registerProvider(new GoogleOAuthProvider());
oauthService.registerProvider(new GitHubOAuthProvider());

// Register chat adapters
chatService.registerAdapter(new GoogleADKChatModelAdapter());
chatService.registerAdapter(new LangGraphChatModelAdapter());
