import React from 'react';

import { ThreadPrimitive } from '@assistant-ui/react';
import { Box, Button, Divider } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { AssistantMessage } from './AssistantMessage';
import { ChatComposer } from './ChatComposer';
import { UserMessage } from './UserMessage';

export const ChatThread: React.FC = () => {
  const { t } = useTranslation('FeatureChat');

  return (
    <ThreadPrimitive.Root
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <ThreadPrimitive.Viewport
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: '1rem',
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

      <Divider my="md" />

      <Box>
        <ChatComposer />
      </Box>

      <ThreadPrimitive.ScrollToBottom asChild>
        <Button
          variant="subtle"
          size="xs"
          style={{
            position: 'absolute',
            bottom: '100px',
            right: '20px',
          }}
        >
          ↓
        </Button>
      </ThreadPrimitive.ScrollToBottom>
    </ThreadPrimitive.Root>
  );
};
