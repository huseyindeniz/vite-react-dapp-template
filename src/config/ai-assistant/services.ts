import { ChatService } from '@/services/chat/ChatService';
import { DemoChatModelAdapter } from '@/services/chat/DemoChatModelAdapter';
import { GoogleADKChatModelAdapter } from '@/services/chat/GoogleADKChatModelAdapter';
import { LangGraphChatModelAdapter } from '@/services/chat/LangGraphChatModelAdapter';
import { SimpleAttachmentAdapter } from '@/services/chat/SimpleAttachmentAdapter';

export const chatService = ChatService.getInstance();

// Register chat adapters
chatService.registerAdapter(new DemoChatModelAdapter());
chatService.registerAdapter(new GoogleADKChatModelAdapter());
chatService.registerAdapter(new LangGraphChatModelAdapter());

// Instantiate attachment adapter (singleton for the application)
export const attachmentAdapter = new SimpleAttachmentAdapter();
