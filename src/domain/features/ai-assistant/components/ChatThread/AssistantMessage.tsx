import { MessagePrimitive } from '@assistant-ui/react';
import { Avatar, Group, Paper } from '@mantine/core';

import { useAgent } from '../../hooks/useAgent';
import { useMarkdownPanel } from '../../hooks/useMarkdownPanel';
import { FileArtifact } from '../Artifacts/FileArtifact';
import { ImageArtifact } from '../Artifacts/ImageArtifact';
import { MarkdownText } from '../Artifacts/MarkdownText';

export const AssistantMessage = () => {
  const { iconPath } = useAgent();
  const { openPanel } = useMarkdownPanel();

  return (
    <MessagePrimitive.Root
      style={{
        marginBottom: '0.5rem',
        display: 'flex',
        justifyContent: 'flex-start',
      }}
    >
      <Group align="flex-start" gap="xs" wrap="nowrap">
        <Avatar src={iconPath} size="md" radius="xl" />
        <Paper
          px="xs"
          py={2}
          radius="md"
          withBorder
          style={{ maxWidth: '70%' }}
        >
          <MessagePrimitive.Parts
            components={{
              Text: MarkdownText,
              Image: (props: { type: 'image'; image: string }) => (
                <ImageArtifact part={props} />
              ),
              File: (props: {
                type: 'file';
                filename?: string;
                data: string;
                mimeType: string;
              }) => <FileArtifact part={props} onMarkdownClick={openPanel} />,
            }}
          />
        </Paper>
      </Group>
    </MessagePrimitive.Root>
  );
};
