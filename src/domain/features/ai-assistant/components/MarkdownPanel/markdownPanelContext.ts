import { createContext } from 'react';

import { MarkdownPanelContextValue } from './types/MarkdownPanelContextValue';

export type { MarkdownPanelContextValue };

export const MarkdownPanelContext = createContext<MarkdownPanelContextValue | undefined>(undefined);
