import type { SuggestionCategory } from '../types/SuggestionCategory';

/**
 * Suggestion categories configuration
 * Defines category labels and their button colors
 */
export const SUGGESTION_CATEGORIES: Record<string, SuggestionCategory> = {
  default: {
    name: 'Quick Actions',
    color: 'gray',
  },
  content: {
    name: 'Content Generation',
    color: 'blue',
  },
  data: {
    name: 'Data Export',
    color: 'green',
  },
};
