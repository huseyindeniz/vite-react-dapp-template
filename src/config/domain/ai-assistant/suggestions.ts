import { TFunction } from 'i18next';

import { ChatSuggestion } from '@/domain/features/ai-assistant/types/ChatSuggestion';

/**
 * Chat suggestions configuration factory
 * Users can add/remove/modify suggestions here
 *
 * @param t - Translation function with 'ai-assistant' namespace
 * @returns Array of chat suggestions
 */
export const getChatSuggestions = (
  t: TFunction<'feature-ai-assistant'>
): ChatSuggestion[] => [
  {
    id: 'generate-image',
    label: t('Generate a sample image'),
    prompt: t('show me an image'),
    category: 'default',
    color: 'blue',
    send: false, // Fill composer, let user send
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
