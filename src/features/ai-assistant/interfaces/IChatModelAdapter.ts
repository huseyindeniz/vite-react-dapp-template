import type { ChatModelAdapter } from '@assistant-ui/react';

import type { AgentType } from '../config';

/**
 * Extended chat model adapter interface
 * Extends library's ChatModelAdapter with type property for self-identification
 */
export interface IChatModelAdapter extends ChatModelAdapter {
  /**
   * The agent type this adapter implements
   */
  readonly type: AgentType;
}
