import React, { useState } from 'react';

import {
  ActionIcon,
  Badge,
  Group,
  Paper,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { MdContentCopy, MdDownload, MdInsertDriveFile } from 'react-icons/md';

interface FileArtifactProps {
  part: {
    type: 'file';
    filename?: string;
    data: string;
    mimeType: string;
  };
  onMarkdownClick?: (filename: string, content: string) => void;
}

/**
 * File artifact component - handles AI-generated files
 * - Markdown files: Clickable to open preview panel
 * - Other files: Download button only
 */
export const FileArtifact: React.FC<FileArtifactProps> = ({
  part,
  onMarkdownClick,
}) => {
  const { t } = useTranslation('feature-ai-assistant');
  const [copied, setCopied] = useState(false);
  const { filename = 'file', data, mimeType } = part;

  const isMarkdown = mimeType === 'text/markdown';

  const handleDownload = () => {
    const blob = new Blob([data], {
      type: mimeType,
    });
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
    await navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMarkdownClick = () => {
    if (isMarkdown && onMarkdownClick) {
      onMarkdownClick(filename, data);
    }
  };

  const getFileExtension = () => {
    if (mimeType === 'text/markdown') {
      return 'MD';
    }
    if (mimeType === 'application/json') {
      return 'JSON';
    }
    if (mimeType === 'text/csv') {
      return 'CSV';
    }
    if (mimeType === 'application/pdf') {
      return 'PDF';
    }
    if (mimeType === 'text/plain') {
      return 'TXT';
    }
    return 'FILE';
  };

  const fileSize = new Blob([data]).size;

  return (
    <Paper withBorder p="md" my="sm">
      <Group justify="space-between" wrap="nowrap">
        <Group gap="sm" style={{ flex: 1, minWidth: 0 }}>
          <MdInsertDriveFile size={24} color="var(--mantine-color-blue-6)" />

          <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
            {isMarkdown ? (
              <Text
                fw={500}
                style={{
                  cursor: 'pointer',
                  color: 'var(--mantine-color-blue-6)',
                  textDecoration: 'underline',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                onClick={handleMarkdownClick}
              >
                {filename}
              </Text>
            ) : (
              <Text
                fw={500}
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {filename}
              </Text>
            )}

            <Group gap="xs">
              <Badge size="xs" variant="light">
                {getFileExtension()}
              </Badge>
              <Text size="xs" c="dimmed">
                {formatFileSize(fileSize)}
              </Text>
            </Group>
          </Stack>
        </Group>

        <Group gap="xs">
          <Tooltip label={copied ? 'Copied!' : 'Copy content'}>
            <ActionIcon
              variant="subtle"
              onClick={handleCopy}
              color={copied ? 'green' : 'gray'}
            >
              <MdContentCopy size={18} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label={t('Download file')}>
            <ActionIcon variant="subtle" onClick={handleDownload} color="gray">
              <MdDownload size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
    </Paper>
  );
};

/**
 * Format file size in human-readable format
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
