import type { ChatSuggestion } from '../types/ChatSuggestion';

/**
 * Demo agent artifact suggestions
 */
export const CHAT_SUGGESTIONS: ChatSuggestion[] = [
  {
    id: 'generate-image',
    label: 'Generate a sample image',
    prompt: 'show me an image',
    send: false, // Fill composer, let user send
    category: 'content',
  },
  {
    id: 'create-markdown',
    label: 'Create a sample document',
    prompt: 'create a markdown document',
    send: false,
    category: 'content',
  },
  {
    id: 'export-json',
    label: 'Export sample data as JSON',
    prompt: 'export data as json',
    send: false,
    category: 'data',
  },
  {
    id: 'export-csv',
    label: 'Export sample data as CSV',
    prompt: 'export to csv',
    send: false,
    category: 'data',
  },
];
