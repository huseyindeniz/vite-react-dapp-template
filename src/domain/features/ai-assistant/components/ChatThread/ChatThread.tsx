import React from 'react';

import { ThreadPrimitive } from '@assistant-ui/react';
import { Button, Divider } from '@mantine/core';

import { ChatComposer } from '../ChatComposer/ChatComposer';

import { AssistantMessage } from './AssistantMessage';
import { EmptyState } from './EmptyState';
import { UserMessage } from './UserMessage';

export const ChatThread: React.FC = () => {

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
            <EmptyState />
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

      <ChatComposer />
    </ThreadPrimitive.Root>
  );
};
