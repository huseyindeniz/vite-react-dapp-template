import log from 'loglevel';

import { AgentType } from '@/config/domain/ai-assistant/config';
import { IChatModelAdapter } from '@/domain/features/ai-assistant/interfaces/IChatModelAdapter';
import { IChatService } from '@/domain/features/ai-assistant/interfaces/IChatService';

/**
 * Chat service that manages chat adapters and token provider
 * Implements dependency injection pattern for chat model adapters
 */
export class ChatService implements IChatService {
  private static instance: ChatService;
  private adapters = new Map<AgentType, IChatModelAdapter>();
  private tokenProvider: (() => string) | null = null;

  private constructor() {
    log.debug('ChatService initialized');
  }

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  registerAdapter(adapter: IChatModelAdapter): void {
    this.adapters.set(adapter.type, adapter);
    log.debug(`Registered chat adapter: ${adapter.type}`);
  }

  getAdapter(type: AgentType): IChatModelAdapter {
    const adapter = this.adapters.get(type);
    if (!adapter) {
      throw new Error(
        `Chat adapter "${type}" not registered. Available: ${Array.from(this.adapters.keys()).join(', ')}`
      );
    }
    return adapter;
  }

  hasAdapter(type: AgentType): boolean {
    return this.adapters.has(type);
  }

  setTokenProvider(getToken: () => string): void {
    this.tokenProvider = getToken;
    log.debug('Token provider updated');
  }

  getToken(): string {
    if (!this.tokenProvider) {
      log.warn('Token provider not set, returning anonymous');
      return 'anonymous';
    }
    return this.tokenProvider();
  }

  /**
   * Get all registered adapter types
   * Useful for debugging and validation
   */
  getRegisteredTypes(): AgentType[] {
    return Array.from(this.adapters.keys());
  }

  /**
   * Reset the service (mainly for testing)
   */
  reset(): void {
    this.adapters.clear();
    this.tokenProvider = null;
    log.debug('ChatService reset');
  }
}
