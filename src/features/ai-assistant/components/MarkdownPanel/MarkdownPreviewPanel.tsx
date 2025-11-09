import React, { useState } from 'react';

import {
  ActionIcon,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { MdClose, MdContentCopy, MdDownload } from 'react-icons/md';
import ReactMarkdown from 'react-markdown';

interface MarkdownPreviewPanelProps {
  filename: string;
  content: string;
  onClose: () => void;
}

/**
 * Right-side markdown preview panel
 * - Slides in from right (50% width)
 * - Displays rendered markdown content
 * - Provides close, download, and copy actions
 */
export const MarkdownPreviewPanel: React.FC<MarkdownPreviewPanelProps> = ({
  filename,
  content,
  onClose,
}) => {
  const { t } = useTranslation('feature-ai-assistant');
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Paper
      withBorder
      shadow="lg"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '50%',
        height: '100vh',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        borderRight: 'none',
      }}
    >
      {/* Header with actions */}
      <Group
        justify="space-between"
        p="md"
        style={{
          borderBottom: '1px solid var(--mantine-color-default-border)',
        }}
      >
        <Text
          fw={500}
          size="lg"
          style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {filename}
        </Text>

        <Group gap="xs">
          <Tooltip label={copied ? t('Copied!') : t('Copy content')}>
            <ActionIcon
              variant="subtle"
              onClick={handleCopy}
              color={copied ? 'green' : 'gray'}
              size="lg"
            >
              <MdContentCopy size={20} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label={t('Download file')}>
            <ActionIcon
              variant="subtle"
              onClick={handleDownload}
              color="gray"
              size="lg"
            >
              <MdDownload size={20} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label={t('Close')}>
            <ActionIcon
              variant="subtle"
              onClick={onClose}
              color="gray"
              size="lg"
            >
              <MdClose size={20} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      {/* Markdown content */}
      <ScrollArea style={{ flex: 1 }}>
        <Stack p="lg">
          <ReactMarkdown>{content}</ReactMarkdown>
        </Stack>
      </ScrollArea>
    </Paper>
  );
};
