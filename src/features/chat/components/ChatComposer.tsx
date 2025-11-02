import { ComposerPrimitive, useComposerRuntime } from '@assistant-ui/react';
import { Button, Group, Stack, Textarea } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IoSend } from 'react-icons/io5';

export const ChatComposer = () => {
  const { t } = useTranslation('feature-chat');
  const composerRuntime = useComposerRuntime();

  return (
    <ComposerPrimitive.Root>
      <Stack gap="sm">
        <ComposerPrimitive.Input asChild>
          <Textarea
            placeholder={t('Type your message... (Shift+Enter for new line)')}
            minRows={2}
            maxRows={6}
            autosize
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                composerRuntime.send();
              }
            }}
          />
        </ComposerPrimitive.Input>

        <Group justify="flex-end">
          <ComposerPrimitive.Send asChild>
            <Button leftSection={<IoSend />}>{t('Send')}</Button>
          </ComposerPrimitive.Send>
        </Group>
      </Stack>
    </ComposerPrimitive.Root>
  );
};
