import { SuggestionCategoryKey } from '@/config/domain/ai-assistant/suggestionCategories';

/**
 * Chat suggestion interface
 * Defines a single quick action/suggestion button
 */
export interface ChatSuggestion {
  id: string;
  label: string;
  prompt: string;
  category: SuggestionCategoryKey;
  color: string; // Mantine color name (e.g., 'blue', 'green', 'orange')
  send?: boolean; // If true, auto-sends; if false, just fills composer
}
