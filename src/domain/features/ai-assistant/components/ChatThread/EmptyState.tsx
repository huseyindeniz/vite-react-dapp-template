import React, { useMemo } from 'react';

import { ThreadPrimitive } from '@assistant-ui/react';
import { Avatar, Button, Group, Stack, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { getSuggestionCategories } from '@/config/domain/ai-assistant/suggestionCategories';
import { getChatSuggestions } from '@/config/domain/ai-assistant/suggestions';

import assistantAvatar from '../../assets/images/assistant-logo.png';
import { ChatSuggestion } from '../../types/ChatSuggestion';

export const EmptyState: React.FC = () => {
  const { t } = useTranslation('feature-ai-assistant');

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

  const categoryKeys = Object.keys(groupedSuggestions);

  return (
    <Stack
      gap="lg"
      align="center"
      justify="center"
      style={{ height: '100%', padding: '2rem' }}
    >
      <Avatar src={assistantAvatar} size={120} radius="xl" />

      <Stack gap="xs" align="center">
        <Text size="lg" fw={600} c="dimmed">
          {t('No messages yet. Start a conversation!')}
        </Text>
        <Text size="sm" c="dimmed" ta="center" style={{ maxWidth: '500px' }}>
          {t(
            'Type anything you want below, or click one of these suggestions to get started:'
          )}
        </Text>
      </Stack>

      {suggestions.length > 0 && (
        <Group gap="lg" align="flex-start" wrap="nowrap">
          {categoryKeys.map(categoryKey => {
            const category =
              suggestionCategories[
                categoryKey as keyof typeof suggestionCategories
              ];
            const categorySuggestions = groupedSuggestions[categoryKey];

            return (
              <Stack key={categoryKey} gap="xs" style={{ minWidth: '200px' }}>
                <Text size="sm" fw={600} c={category.color}>
                  {category.name}
                </Text>
                <Stack gap="xs">
                  {categorySuggestions.map(suggestion => (
                    <ThreadPrimitive.Suggestion
                      key={suggestion.id}
                      prompt={suggestion.prompt}
                      send={suggestion.send}
                      asChild
                    >
                      <Button
                        variant="light"
                        size="sm"
                        color={suggestion.color}
                        fullWidth
                        style={{ justifyContent: 'flex-start' }}
                      >
                        {suggestion.label}
                      </Button>
                    </ThreadPrimitive.Suggestion>
                  ))}
                </Stack>
              </Stack>
            );
          })}
        </Group>
      )}
    </Stack>
  );
};
