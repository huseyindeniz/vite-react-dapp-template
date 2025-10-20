import type {
  ChatModelAdapter,
  ChatModelRunOptions,
  ChatModelRunResult,
} from '@assistant-ui/react';
import log from 'loglevel';

export class LangGraphChatModelAdapter implements ChatModelAdapter {
  private baseUrl: string;
  private getToken: () => string;

  constructor(baseUrl: string = 'http://localhost:8010', getToken: () => string) {
    this.baseUrl = baseUrl;
    this.getToken = getToken;
  }

  async *run(options: ChatModelRunOptions): AsyncGenerator<ChatModelRunResult> {
    const { messages, abortSignal } = options;

    // Get auth token from hook for session persistence
    const token = this.getToken();

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

      log.info('Sending message to backend:', userMessageText);

      const response = await fetch(`${this.baseUrl}/assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commands: [
            {
              type: 'add-message',
              message: {
                role: 'user',
                parts: [
                  {
                    type: 'text',
                    text: userMessageText,
                  },
                ],
              },
            },
          ],
          token, // Auth token for session persistence
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
                const data = JSON.parse(line.slice(6));
                log.info('SSE data received:', data);

                if (data.type === 'message') {
                  const delta = data.delta || data.content || '';
                  accumulatedText += delta;
                  log.info('Accumulated text:', accumulatedText);
                  yield {
                    content: [
                      {
                        type: 'text' as const,
                        text: accumulatedText,
                      },
                    ],
                  };
                } else if (data.type === 'end') {
                  log.info('Stream ended, final text:', accumulatedText);
                  return {
                    content: [
                      {
                        type: 'text' as const,
                        text: accumulatedText,
                      },
                    ],
                    status: { type: 'complete' as const, reason: 'stop' as const },
                  };
                } else if (data.type === 'error') {
                  throw new Error(data.message || 'Unknown error');
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
        content: [],
        status: { type: 'complete' as const, reason: 'stop' as const },
      };
    } catch (error) {
      log.error('ChatModelAdapter error:', error);
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
