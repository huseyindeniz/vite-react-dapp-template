import { ChatSuggestion } from './ChatSuggestion';
import { FileAttachmentConfig } from './FileAttachmentConfig';
import { MessageValidationConfig } from './MessageValidationConfig';
import { SuggestionCategories } from './SuggestionCategories';

/**
 * Complete agent configuration
 * Each agent has its own config for all settings
 */
export interface AgentConfig {
  label: string;
  enabled: boolean;
  suggestions: ChatSuggestion[];
  suggestionCategories: SuggestionCategories;
  messageValidation: MessageValidationConfig;
  fileAttachment: FileAttachmentConfig;
}
