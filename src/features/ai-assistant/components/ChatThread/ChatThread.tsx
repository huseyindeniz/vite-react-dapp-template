import React from 'react';

import { ThreadPrimitive } from '@assistant-ui/react';
import { Box, Button, Divider, Stack } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { ChatComposer } from '../ChatComposer/ChatComposer';
import { SuggestionsBar } from '../ChatComposer/SuggestionsBar';

import { AssistantMessage } from './AssistantMessage';
import { UserMessage } from './UserMessage';

export const ChatThread: React.FC = () => {
  const { t } = useTranslation('feature-ai-assistant');

  return (
    <ThreadPrimitive.Root
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <ThreadPrimitive.Viewport
          style={{
            height: '100%',
            overflowY: 'auto',
            padding: '0 3rem 0.5rem 0',
          }}
        >
          <ThreadPrimitive.Empty>
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'var(--mantine-color-dimmed)',
              }}
            >
              {t('No messages yet. Start a conversation!')}
            </Box>
          </ThreadPrimitive.Empty>

          <ThreadPrimitive.Messages
            components={{
              UserMessage,
              AssistantMessage,
            }}
          />
        </ThreadPrimitive.Viewport>

        <ThreadPrimitive.ScrollToBottom asChild>
          <Button
            variant="subtle"
            size="xs"
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
            }}
          >
            ↓
          </Button>
        </ThreadPrimitive.ScrollToBottom>
      </div>

      <Divider my="md" />

      <Stack gap="sm">
        <ChatComposer />
        <SuggestionsBar />
      </Stack>
    </ThreadPrimitive.Root>
  );
};
