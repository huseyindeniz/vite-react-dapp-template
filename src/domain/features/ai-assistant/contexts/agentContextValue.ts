import { createContext } from 'react';

import { AgentType } from '@/config/domain/ai-assistant/config';

import { ChatSuggestion } from '../types/ChatSuggestion';
import { FileAttachmentConfig } from '../types/FileAttachmentConfig';
import { MessageValidationConfig } from '../types/MessageValidationConfig';
import { SuggestionCategories } from '../types/SuggestionCategories';

/**
 * Agent context value with explicit fields
 * Components destructure only what they need
 */
export interface AgentContextValue {
  // Agent identity
  agentType: AgentType;
  label: string;
  enabled: boolean;
  iconPath: string;

  // Suggestions
  suggestions: ChatSuggestion[];
  suggestionCategories: SuggestionCategories;

  // Validation & Limits
  messageValidation: MessageValidationConfig;
  fileAttachment: FileAttachmentConfig;
}

export const AgentContext = createContext<AgentContextValue | null>(null);
