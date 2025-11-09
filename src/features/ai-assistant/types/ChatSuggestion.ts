import type { SuggestionCategoryKey } from '@/config/ai-assistant/suggestionCategories';

/**
 * Chat suggestion interface
 * Defines a single quick action/suggestion button
 */
export interface ChatSuggestion {
  id: string;
  label: string;
  prompt: string;
  category: SuggestionCategoryKey;
  send?: boolean; // If true, auto-sends; if false, just fills composer
}
