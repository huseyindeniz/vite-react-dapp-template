export const CHAT_AGENTS = {
  langgraph: {
    label: 'Agent 1 (with Langgraph)',
    enabled: false,
  },
  'google-adk': {
    label: 'Agent 2 (with Google ADK)',
    enabled: false,
  },
  demo: {
    label: 'Agent 3 (demo)',
    enabled: true,
  },
} as const;

export type AgentType = keyof typeof CHAT_AGENTS;

export const DEFAULT_AGENT_TYPE: AgentType = 'demo';

/**
 * Message validation configuration
 */
export const MESSAGE_VALIDATION_CONFIG = {
  maxLength: 1000,
} as const;

/**
 * File attachment validation configuration
 */
export const FILE_ATTACHMENT_CONFIG = {
  maxFiles: 5,
  maxFileSize: 10 * 1024 * 1024, // 10MB in bytes
  allowedTypes: [
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    // Text
    'text/plain',
    'text/csv',
    'text/markdown',
    // Code
    'application/json',
    'application/javascript',
    'text/javascript',
    'text/html',
    'text/css',
  ],
  allowedExtensions: [
    // Images
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.webp',
    '.svg',
    // Documents
    '.pdf',
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.ppt',
    '.pptx',
    // Text
    '.txt',
    '.csv',
    '.md',
    // Code
    '.json',
    '.js',
    '.ts',
    '.jsx',
    '.tsx',
    '.html',
    '.css',
  ],
} as const;
