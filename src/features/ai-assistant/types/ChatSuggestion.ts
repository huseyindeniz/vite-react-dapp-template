/**
 * Chat suggestion interface
 * Defines a single quick action/suggestion button
 */
export interface ChatSuggestion {
  id: string;
  label: string;
  prompt: string;
  send?: boolean; // If true, auto-sends; if false, just fills composer
  category?: string; // Optional category name
}
