import { useContext } from 'react';

import { MarkdownPanelContext } from '../components/MarkdownPanel/markdownPanelContext';
import { MarkdownPanelContextValue } from '../components/MarkdownPanel/types/MarkdownPanelContextValue';

/**
 * Hook to access markdown panel context
 * @throws Error if used outside MarkdownPanelProvider
 */
export const useMarkdownPanel = (): MarkdownPanelContextValue => {
  const context = useContext(MarkdownPanelContext);
  if (!context) {
    throw new Error('useMarkdownPanel must be used within MarkdownPanelProvider');
  }
  return context;
};
