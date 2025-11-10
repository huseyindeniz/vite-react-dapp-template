import React, { useMemo } from 'react';

import { ThreadPrimitive } from '@assistant-ui/react';
import {
  ActionIcon,
  Button,
  Collapse,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';

import { getSuggestionCategories } from '@/config/domain/ai-assistant/suggestionCategories';
import { getChatSuggestions } from '@/config/domain/ai-assistant/suggestions';

import { ChatSuggestion } from '../../types/ChatSuggestion';

/**
 * Suggestions bar - displays quick action buttons grouped by category
 * Features:
 * - Collapsible sections
 * - Category labels with configurable colors
 * - Horizontal layout per category
 */
export const SuggestionsBar: React.FC = () => {
  const { t } = useTranslation('feature-ai-assistant');
  const [opened, { toggle }] = useDisclosure(false);

  const suggestionCategories = useMemo(() => getSuggestionCategories(t), [t]);
  const suggestions = useMemo(() => getChatSuggestions(t), [t]);

  // Group suggestions by category
  const groupedSuggestions = useMemo(() => {
    const groups: Record<string, ChatSuggestion[]> = {};

    suggestions.forEach(suggestion => {
      const categoryKey = suggestion.category;
      if (!groups[categoryKey]) {
        groups[categoryKey] = [];
      }
      groups[categoryKey].push(suggestion);
    });

    return groups;
  }, [suggestions]);

  if (suggestions.length === 0) {
    return null;
  }

  const categoryKeys = Object.keys(groupedSuggestions);
  const hasMultipleCategories = categoryKeys.length > 1;

  return (
    <Stack gap="xs">
      <Group gap="xs" align="center">
        <Text size="sm" fw={500} c="dimmed">
          {t('Suggestions')}
        </Text>
        <ActionIcon
          variant="subtle"
          size="sm"
          onClick={toggle}
          aria-label={
            opened ? t('Collapse suggestions') : t('Expand suggestions')
          }
        >
          {opened ? <MdExpandLess size={16} /> : <MdExpandMore size={16} />}
        </ActionIcon>
      </Group>

      <Collapse in={opened}>
        <Stack gap="sm">
          {categoryKeys.map(categoryKey => {
            const category =
              suggestionCategories[
                categoryKey as keyof typeof suggestionCategories
              ];
            const categorySuggestions = groupedSuggestions[categoryKey];

            return (
              <div key={categoryKey}>
                {hasMultipleCategories && (
                  <Text size="xs" c="dimmed" mb={4}>
                    {category.name}
                  </Text>
                )}
                <Group gap="xs">
                  {categorySuggestions.map(suggestion => (
                    <ThreadPrimitive.Suggestion
                      key={suggestion.id}
                      prompt={suggestion.prompt}
                      send={suggestion.send}
                      asChild
                    >
                      <Button variant="light" size="xs" color={category.color}>
                        {suggestion.label}
                      </Button>
                    </ThreadPrimitive.Suggestion>
                  ))}
                </Group>
              </div>
            );
          })}
        </Stack>
      </Collapse>
    </Stack>
  );
};
