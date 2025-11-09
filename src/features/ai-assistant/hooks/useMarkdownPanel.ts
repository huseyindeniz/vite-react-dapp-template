import { useContext } from 'react';

import {
  MarkdownPanelContext,
  type MarkdownPanelContextValue,
} from '../components/MarkdownPanel/markdownPanelContext';

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
