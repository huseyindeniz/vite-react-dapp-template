import { AgentType } from '@/config/domain/ai-assistant/config';

import { IChatModelAdapter } from './IChatModelAdapter';

/**
 * Chat service interface for dependency injection
 * Features use this interface to manage chat adapters without knowing concrete implementations
 */
export interface IChatService {
  /**
   * Register a chat adapter
   * Adapter defines its own type property
   * @param adapter - The chat model adapter to register
   */
  registerAdapter: (adapter: IChatModelAdapter) => void;

  /**
   * Get a registered chat adapter by type
   * @param type - The agent type
   * @returns Chat model adapter instance
   * @throws Error if adapter not registered
   */
  getAdapter: (type: AgentType) => IChatModelAdapter;

  /**
   * Check if an adapter is registered for the given type
   * @param type - The agent type
   * @returns True if adapter is registered
   */
  hasAdapter: (type: AgentType) => boolean;

  /**
   * Set the token provider function
   * Called by hooks to provide current user token
   * @param getToken - Function to get current user token
   */
  setTokenProvider: (getToken: () => string) => void;

  /**
   * Get current user token
   * Used by adapters to access authentication token
   * @returns Current user token or 'anonymous'
   */
  getToken: () => string;
}
