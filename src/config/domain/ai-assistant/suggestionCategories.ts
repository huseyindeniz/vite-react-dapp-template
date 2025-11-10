import { TFunction } from 'i18next';

import { SuggestionCategory } from '@/domain/features/ai-assistant/types/SuggestionCategory';

/**
 * Suggestion categories configuration factory
 * Users can add/remove/modify categories here
 *
 * @param t - Translation function with 'ai-assistant' namespace
 * @returns Record of category configurations
 */
export const getSuggestionCategories = (
  t: TFunction<'feature-ai-assistant'>
) => {
  return {
    default: {
      name: t('Quick Actions'),
      color: 'blue',
    },
    data: {
      name: t('Data Export'),
      color: 'orange',
    },
  } as const satisfies Record<string, SuggestionCategory>;
};

/**
 * Type-safe category keys derived from config
 * Automatically updates when categories are added/removed
 */
export type SuggestionCategoryKey = keyof ReturnType<
  typeof getSuggestionCategories
>;
