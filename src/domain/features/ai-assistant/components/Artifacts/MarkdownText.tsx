import { memo } from 'react';

import { MarkdownTextPrimitive } from '@assistant-ui/react-markdown';

/**
 * Markdown text renderer for assistant messages
 * Uses @assistant-ui/react-markdown to render markdown content with GFM support
 */
const MarkdownTextImpl = () => {
  return <MarkdownTextPrimitive />;
};

export const MarkdownText = memo(MarkdownTextImpl);
