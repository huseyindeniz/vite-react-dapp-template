import type {
  ChatModelRunOptions,
  ChatModelRunResult,
} from '@assistant-ui/react';
import log from 'loglevel';

import type { AgentType } from '@/features/ai-assistant/config';
import type { IChatModelAdapter } from '@/features/ai-assistant/interfaces/IChatModelAdapter';

import { ChatService } from './ChatService';

const BASE_URL = 'http://localhost:8011';

export class GoogleADKChatModelAdapter implements IChatModelAdapter {
  readonly type: AgentType = 'google-adk';
  private baseUrl: string = BASE_URL;

  async *run(options: ChatModelRunOptions): AsyncGenerator<ChatModelRunResult> {
    const { messages, abortSignal } = options;

    // Get auth token from ChatService for session persistence
    const token = ChatService.getInstance().getToken();

    try {
      const lastUserMessage = messages
        .slice()
        .reverse()
        .find(msg => msg.role === 'user');

      if (!lastUserMessage || lastUserMessage.role !== 'user') {
        throw new Error('No user message found');
      }

      const userMessageText = lastUserMessage.content
        .filter(part => part.type === 'text')
        .map(part => (part.type === 'text' ? part.text : ''))
        .join('\n');

      log.info('Sending message to Google ADK backend:', userMessageText);

      // Send native Google ADK format
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessageText,
          user_id: token,
          session_id: token,
        }),
        signal: abortSignal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.trim() === '') {
              continue;
            }

            if (line.startsWith('data: ')) {
              try {
                const event = JSON.parse(line.slice(6));

                if (event.type === 'token') {
                  // Handle text token streaming
                  accumulatedText += event.content;
                  log.debug('Token received:', event.content);
                  yield {
                    content: [
                      {
                        type: 'text' as const,
                        text: accumulatedText,
                      },
                    ],
                  };
                } else if (event.type === 'end') {
                  // Stream ended
                  log.debug('Stream ended');
                } else if (event.type === 'error') {
                  throw new Error(event.message || 'Unknown error');
                }
              } catch (parseError) {
                log.error('Error parsing SSE data:', parseError, 'Line:', line);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: accumulatedText,
          },
        ],
        status: { type: 'complete' as const, reason: 'stop' as const },
      };
    } catch (error) {
      log.error('GoogleADKChatModelAdapter error:', error);
      return {
        content: [],
        status: {
          type: 'incomplete' as const,
          reason: 'error' as const,
          error:
            error instanceof Error ? error.message : 'Network error occurred',
        },
      };
    }
  }
}
