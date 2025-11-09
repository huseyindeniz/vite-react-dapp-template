import type { MantineColor } from '@mantine/core';

/**
 * Suggestion category configuration
 * Defines display name and button color for a category
 * Users can define custom categories in config
 */
export interface SuggestionCategory {
  name: string;
  color: MantineColor;
}
