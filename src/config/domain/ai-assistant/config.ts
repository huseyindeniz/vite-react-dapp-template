import { TFunction } from 'i18next';

import { AgentConfig } from '@/domain/features/ai-assistant/types/AgentConfig';
import { ChatAgents } from '@/domain/features/ai-assistant/types/ChatAgents';
import { FileAttachmentConfig } from '@/domain/features/ai-assistant/types/FileAttachmentConfig';
import { MessageValidationConfig } from '@/domain/features/ai-assistant/types/MessageValidationConfig';

/**
 * Available AI agent types
 * Add/remove agents here
 */
export enum AgentType {
  LANGGRAPH = 'langgraph',
  GOOGLE_ADK = 'google-adk',
  DEMO = 'demo',
}

export const DEFAULT_AGENT_TYPE: AgentType = AgentType.DEMO;

/**
 * Default message validation configuration
 * Used as fallback and initial adapter config
 */
export const DEFAULT_MESSAGE_VALIDATION: MessageValidationConfig = {
  maxLength: 1000,
};

/**
 * Default file attachment configuration
 * Used as fallback and initial adapter config
 */
export const DEFAULT_FILE_ATTACHMENT: FileAttachmentConfig = {
  maxFiles: 5,
  maxFileSize: 10 * 1024 * 1024, // 10MB in bytes
  allowedTypes: [
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    // Text
    'text/plain',
    'text/csv',
    'text/markdown',
    // Code
    'application/json',
    'application/javascript',
    'text/javascript',
    'text/html',
    'text/css',
  ],
  allowedExtensions: [
    // Images
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.webp',
    '.svg',
    // Documents
    '.pdf',
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.ppt',
    '.pptx',
    // Text
    '.txt',
    '.csv',
    '.md',
    // Code
    '.json',
    '.js',
    '.ts',
    '.jsx',
    '.tsx',
    '.html',
    '.css',
  ],
};

/**
 * Static configuration for agent availability
 * Only contains enabled flags (non-translatable)
 */
const CHAT_AGENTS_ENABLED: Record<AgentType, boolean> = {
  [AgentType.LANGGRAPH]: false,
  [AgentType.GOOGLE_ADK]: false,
  [AgentType.DEMO]: true,
};

/**
 * Get complete chat agents configuration with all settings
 * Factory function that returns agent-specific config including:
 * - Label (translated)
 * - Enabled flag
 * - Suggestions (translated)
 * - Suggestion categories (translated)
 * - Message validation config
 * - File attachment config
 *
 * @param t - Translation function with 'feature-ai-assistant' namespace
 * @returns Record of complete agent configurations
 */
export const getChatAgents = (
  t: TFunction<'feature-ai-assistant'>
): ChatAgents => {
  // Shared suggestions for all agents (can be customized per agent if needed)
  const defaultSuggestions: AgentConfig['suggestions'] = [
    {
      id: 'generate-image',
      label: t('Generate a sample image'),
      prompt: t('show me an image'),
      category: 'default',
      color: 'blue',
      send: false,
    },
    {
      id: 'create-markdown',
      label: t('Create a sample document'),
      prompt: t('create a markdown document'),
      category: 'default',
      color: 'blue',
      send: false,
    },
    {
      id: 'export-json',
      label: t('Export sample data as JSON'),
      prompt: t('export data as json'),
      category: 'data',
      color: 'orange',
      send: false,
    },
    {
      id: 'export-csv',
      label: t('Export sample data as CSV'),
      prompt: t('export data as csv'),
      category: 'data',
      color: 'orange',
      send: false,
    },
  ];

  // Shared suggestion categories for all agents (can be customized per agent if needed)
  const defaultSuggestionCategories: AgentConfig['suggestionCategories'] = {
    default: {
      name: t('Quick Actions'),
      color: 'blue',
    },
    data: {
      name: t('Data Export'),
      color: 'orange',
    },
  };

  return {
    [AgentType.LANGGRAPH]: {
      label: t('Agent 1 (with Langgraph)'),
      enabled: CHAT_AGENTS_ENABLED[AgentType.LANGGRAPH],
      suggestions: defaultSuggestions,
      suggestionCategories: defaultSuggestionCategories,
      messageValidation: DEFAULT_MESSAGE_VALIDATION,
      fileAttachment: DEFAULT_FILE_ATTACHMENT,
    },
    [AgentType.GOOGLE_ADK]: {
      label: t('Agent 2 (with Google ADK)'),
      enabled: CHAT_AGENTS_ENABLED[AgentType.GOOGLE_ADK],
      suggestions: defaultSuggestions,
      suggestionCategories: defaultSuggestionCategories,
      messageValidation: DEFAULT_MESSAGE_VALIDATION,
      fileAttachment: DEFAULT_FILE_ATTACHMENT,
    },
    [AgentType.DEMO]: {
      label: t('Agent 3 (demo)'),
      enabled: CHAT_AGENTS_ENABLED[AgentType.DEMO],
      suggestions: defaultSuggestions,
      suggestionCategories: defaultSuggestionCategories,
      messageValidation: DEFAULT_MESSAGE_VALIDATION,
      fileAttachment: DEFAULT_FILE_ATTACHMENT,
    },
  };
};
