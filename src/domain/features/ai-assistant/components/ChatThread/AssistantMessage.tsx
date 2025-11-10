import { MessagePrimitive } from '@assistant-ui/react';
import { Paper } from '@mantine/core';

import { useMarkdownPanel } from '../../hooks/useMarkdownPanel';
import { FileArtifact } from '../Artifacts/FileArtifact';
import { ImageArtifact } from '../Artifacts/ImageArtifact';
import { MarkdownText } from '../Artifacts/MarkdownText';

export const AssistantMessage = () => {
  const { openPanel } = useMarkdownPanel();

  return (
    <MessagePrimitive.Root
      style={{
        marginBottom: '0.5rem',
        display: 'flex',
        justifyContent: 'flex-start',
      }}
    >
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
            Image: (props: { type: 'image'; image: string }) => <ImageArtifact part={props} />,
            File: (props: { type: 'file'; filename?: string; data: string; mimeType: string }) => (
              <FileArtifact part={props} onMarkdownClick={openPanel} />
            ),
          }}
        />
      </Paper>
    </MessagePrimitive.Root>
  );
};
