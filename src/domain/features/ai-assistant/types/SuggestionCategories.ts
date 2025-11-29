import { SuggestionCategory } from './SuggestionCategory';

/**
 * Flexible suggestion categories
 * Each agent can define its own category keys
 */
export type SuggestionCategories = Record<string, SuggestionCategory>;
