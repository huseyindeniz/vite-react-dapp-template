import { TFunction } from 'i18next';

import { SuggestionCategories } from '@/domain/features/ai-assistant/types/SuggestionCategories';

/**
 * Suggestion categories configuration factory
 * Users can add/remove/modify categories here
 *
 * @param t - Translation function with 'ai-assistant' namespace
 * @returns Record of category configurations
 */
export const getSuggestionCategories = (
  t: TFunction<'feature-ai-assistant'>
): SuggestionCategories => {
  return {
    default: {
      name: t('Quick Actions'),
      color: 'blue',
    },
    data: {
      name: t('Data Export'),
      color: 'orange',
    },
  };
};
