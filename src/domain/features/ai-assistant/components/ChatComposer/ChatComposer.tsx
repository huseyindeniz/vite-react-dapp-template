import { ComposerPrimitive, useAssistantApi } from '@assistant-ui/react';
import { ActionIcon, Flex, Stack, Textarea, Tooltip } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IoSend } from 'react-icons/io5';
import { MdAttachFile } from 'react-icons/md';

import { DocumentAttachment } from './DocumentAttachment';
import { FileAttachment } from './FileAttachment';
import { ImageAttachment } from './ImageAttachment';

export const ChatComposer = () => {
  const { t } = useTranslation('feature-ai-assistant');
  const api = useAssistantApi();

  return (
    <ComposerPrimitive.Root>
      <Stack
        gap="xs"
        p="xs"
        style={{
          border: '1px solid var(--mantine-color-default-border)',
          borderRadius: 'var(--mantine-radius-lg)',
          position: 'relative',
        }}
      >
        {/* Attachments display - top section */}
        <Flex gap="xs" wrap="wrap">
          <ComposerPrimitive.Attachments
            components={{
              Image: ImageAttachment,
              Document: DocumentAttachment,
              File: FileAttachment,
            }}
          />
        </Flex>

        {/* Main input area with buttons on edges */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
          {/* Attach button - left edge */}
          <ComposerPrimitive.AddAttachment multiple asChild>
            <Tooltip label={t('Attach files')}>
              <ActionIcon variant="subtle" size="lg" style={{ alignSelf: 'flex-end' }}>
                <MdAttachFile size={20} />
              </ActionIcon>
            </Tooltip>
          </ComposerPrimitive.AddAttachment>

          {/* Text input - center */}
          <ComposerPrimitive.Input asChild>
            <Textarea
              placeholder={t('Type your message... (Shift+Enter for new line)')}
              minRows={1}
              maxRows={6}
              autosize
              variant="unstyled"
              style={{ flex: 1 }}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  api.composer().send();
                }
              }}
            />
          </ComposerPrimitive.Input>

          {/* Send button - right edge */}
          <ComposerPrimitive.Send asChild>
            <Tooltip label={t('Send')}>
              <ActionIcon variant="filled" size="lg" style={{ alignSelf: 'flex-end' }}>
                <IoSend size={20} />
              </ActionIcon>
            </Tooltip>
          </ComposerPrimitive.Send>
        </div>
      </Stack>
    </ComposerPrimitive.Root>
  );
};
