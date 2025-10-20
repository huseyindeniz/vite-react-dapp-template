# 🎯 Assistant-UI Integration Plan

> **Issue**: #68 - Add Chat Module - The AI Agent Era Demands It
> **Created**: 2025-10-19
> **Status**: Planning Phase

---

## 📋 Executive Summary

This plan outlines the integration of **assistant-ui** library into the vite-react-dapp-template project. The goal is to create a modern, AI-powered chat experience that seamlessly integrates with the existing architecture (Redux, Saga, Mantine, feature-based organization).

**Key Decision**: We will use assistant-ui's LocalRuntime as the foundation, but integrate it with Redux for persistent state management and leverage existing patterns.

---

## 📚 About assistant-ui

### Key Features
- ⭐ **6,744 GitHub stars**, 200k+ monthly downloads
- 🏗️ **Radix-style primitives** - Composable, similar to shadcn/ui
- 🔄 **Streaming support** - Real-time AI responses
- 🎨 **Headless UI** - Bring your own styles
- 🔌 **Backend agnostic** - OpenAI, Anthropic, LangGraph, custom
- 📦 **TypeScript** - Full type support
- ♿ **Accessible** - Built-in ARIA support

### Architectural Approach
- **Runtime Layer**: Chat state management (LocalRuntime, ExternalStoreRuntime)
- **UI Primitives**: Composable components
- **Adapter Pattern**: Works with any backend

**Official Documentation**: https://www.assistant-ui.com

---

## 🏗️ Architectural Design Decisions

### 1. Feature-Based Organization

Following the existing project pattern:

```
src/features/chat/
├── components/          # UI components
│   ├── ChatInterface/
│   ├── ChatMessage/
│   ├── ChatInput/
│   ├── ConversationList/
│   ├── ChatSettings/
│   ├── FileUpload/
│   └── ...
├── models/             # Redux slices
│   ├── conversation/   # Conversation management
│   │   ├── actions.ts
│   │   ├── slice.ts
│   │   ├── types/
│   │   └── actionEffects/
│   ├── message/        # Message CRUD
│   │   ├── actions.ts
│   │   ├── slice.ts
│   │   ├── types/
│   │   └── actionEffects/
│   └── settings/       # Chat settings
│       ├── actions.ts
│       ├── slice.ts
│       └── types/
├── hooks/              # Custom hooks
│   ├── useChat.ts
│   ├── useChatActions.ts
│   └── useSyncAssistantToRedux.ts
├── runtime/            # assistant-ui runtime integration
│   ├── ReduxChatRuntime.ts
│   └── ChatRuntimeProvider.tsx
├── services/           # Chat API integration
│   └── IChatApi.ts
├── types/              # TypeScript interfaces
│   ├── Message.ts
│   ├── Conversation.ts
│   └── IChatApi.ts
├── translations/       # i18n
│   ├── en-US/
│   └── tr-TR/
├── sagas.ts            # Redux-Saga watchers
├── slice.ts            # Root reducer
└── configureChat.ts    # SliceLifecycleManager config
```

### 2. Hybrid State Management Strategy

**Decision**: Use assistant-ui's LocalRuntime, BUT integrate with Redux.

**Why?**
- ✅ Leverage assistant-ui's built-in streaming and state management
- ✅ Store persistent data in Redux (conversation history, user preferences)
- ✅ Seamless integration with existing auth system and slice-manager
- ✅ Time-travel debugging, middleware support

**How?**

```typescript
// src/features/chat/runtime/ReduxChatRuntime.ts
class ReduxChatAdapter {
  constructor(
    private chatApi: IChatApi,
    private dispatch: Dispatch,
    private getState: () => RootState
  ) {}

  // Syncs assistant-ui runtime with Redux
  async sendMessage(message: Message) {
    // 1. Dispatch Redux action
    dispatch(chatActions.sendMessage(message));

    // 2. API call (streaming)
    const response = await this.chatApi.streamMessage(message);

    // 3. Send streaming response to both assistant-ui and Redux
    return response;
  }
}
```

### 3. Authentication Integration Strategy

Provide auth token to Chat API from 3 different sources:

```typescript
interface IChatApi {
  // Auth token provider - wallet or OAuth
  getAuthToken(): Promise<string | null>;

  // Streaming chat message
  streamMessage(
    conversationId: string,
    message: string,
    authToken: string
  ): AsyncGenerator<MessageChunk>;
}

// Implementation
class ChatApiService implements IChatApi {
  async getAuthToken(): Promise<string | null> {
    const state = store.getState();

    // 1. Wallet authentication (dApp-specific)
    if (state.wallet.account.isConnected) {
      return state.wallet.account.signature; // Wallet signature as token
    }

    // 2. OAuth authentication (Google, GitHub)
    if (state.auth.user?.token) {
      return state.auth.user.token;
    }

    // 3. No auth (guest mode - if supported by backend)
    return null;
  }
}
```

### 4. Mantine Theme Integration

assistant-ui uses Tailwind CSS and shadcn/ui styles by default. Our approach:

**Option A (Recommended): Custom Implementation with Mantine Components**

```typescript
// Use assistant-ui primitives, style with Mantine
import { useThreadMessages } from '@assistant-ui/react';
import { Paper, Stack, TextInput, ActionIcon } from '@mantine/core';

export const ChatMessage: FC = () => {
  const { messages } = useThreadMessages();

  return (
    <Paper shadow="sm" p="md">
      <Stack gap="md">
        {messages.map(msg => (
          <MantineMessageBubble key={msg.id} message={msg} />
        ))}
      </Stack>
    </Paper>
  );
};
```

**Option B: CSS Override**

```css
/* Override assistant-ui default styles */
.aui-message-root {
  font-family: var(--mantine-font-family);
  /* Use Mantine theme values */
}
```

**Decision**: **Option A** - More control, aligned with existing component patterns.

---

## 🗂️ State Management Details

### Redux Store Shape

```typescript
// State shape
interface ChatState {
  conversations: {
    ids: string[];
    entities: Record<string, Conversation>;
    activeConversationId: string | null;
    loadingStatus: LoadingStatusType;
    error: string | null;
  };
  messages: {
    // Using EntityAdapter
    ids: string[];
    entities: Record<string, Message>;
    // Message grouping by conversation
    byConversation: Record<string, string[]>;
    // Streaming state
    streamingMessageId: string | null;
  };
  settings: {
    model: string; // 'gpt-4', 'claude-3-opus', etc.
    temperature: number;
    maxTokens: number;
    systemPrompt: string;
    streamingEnabled: boolean;
  };
  ui: {
    isSidebarOpen: boolean;
    isTyping: boolean;
    error: string | null;
  };
}

// Type definitions
interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messageCount: number;
  metadata?: Record<string, unknown>;
}

interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  status: 'pending' | 'streaming' | 'completed' | 'error';
  metadata?: {
    model?: string;
    tokens?: number;
    finishReason?: string;
    [key: string]: unknown;
  };
}
```

### Saga Flows

```typescript
// Streaming message saga
function* handleSendMessage(action: ReturnType<typeof sendMessage>) {
  const { conversationId, content } = action.payload;

  try {
    // 1. Optimistic update - add user message
    const tempMessage = createTempMessage(content, 'user');
    yield put(addMessage(tempMessage));

    // 2. Get auth token
    const authToken = yield call(chatApi.getAuthToken);

    // 3. Create assistant message placeholder
    const assistantMessage = createTempMessage('', 'assistant');
    yield put(addMessage(assistantMessage));
    yield put(setStreamingMessageId(assistantMessage.id));

    // 4. Create streaming channel
    const channel = yield call(
      createStreamingChannel,
      chatApi.streamMessage(conversationId, content, authToken)
    );

    // 5. Handle streaming chunks
    while (true) {
      const chunk = yield take(channel);
      if (chunk === END) break;

      yield put(appendMessageChunk({
        messageId: assistantMessage.id,
        delta: chunk.delta,
      }));
    }

    // 6. Finalize message
    yield put(finalizeMessage(assistantMessage.id));
    yield put(setStreamingMessageId(null));

  } catch (error) {
    yield put(setError((error as Error).message));
    yield put(setStreamingMessageId(null));
  }
}

// Load conversations saga
function* handleLoadConversations() {
  try {
    yield put(setLoading(LoadingStatusType.REQUESTED));

    const authToken = yield call(chatApi.getAuthToken);
    const conversations = yield call(chatApi.getConversations, authToken);

    yield put(setConversations(conversations));
    yield put(setLoading(LoadingStatusType.IDLE));

  } catch (error) {
    yield put(setError((error as Error).message));
    yield put(setLoading(LoadingStatusType.IDLE));
  }
}
```

### SliceLifecycleManager Configuration

```typescript
// src/features/chat/configureChat.ts
export const ChatSlices = {
  CONVERSATIONS: 'conversations',
  MESSAGES: 'messages',
  SETTINGS: 'settings',
} as const;

export const configureChatFeature = () => {
  const manager = getSliceManager();

  // Register the chat feature with its routes
  const chatFeatureConfig: FeatureRouteConfig = {
    name: 'chat',
    routes: [
      /^\/chat($|\/)/, // /chat, /chat/, /chat/anything
    ],
    slices: [
      ChatSlices.CONVERSATIONS,
      ChatSlices.MESSAGES,
      ChatSlices.SETTINGS,
    ],
  };

  manager.registerFeature(chatFeatureConfig);

  // Register individual slices with their specific strategies
  const chatSliceConfigs: SliceConfig[] = [
    {
      name: ChatSlices.CONVERSATIONS,
      feature: 'chat',
      cleanupStrategy: 'cached',
      cacheTimeout: 1000 * 60 * 30, // 30 minutes cache
      cleanupReducerName: 'cleanup',
      cleanupDelay: 1000 * 5, // Wait 5 seconds before cleanup
    },
    {
      name: ChatSlices.MESSAGES,
      feature: 'chat',
      cleanupStrategy: 'cached',
      cacheTimeout: 1000 * 60 * 30, // 30 minutes cache
      cleanupReducerName: 'cleanup',
      cleanupDelay: 1000 * 5,
    },
    {
      name: ChatSlices.SETTINGS,
      feature: 'chat',
      cleanupStrategy: 'persistent', // Never cleanup automatically
      cleanupReducerName: 'cleanup',
    },
  ];

  chatSliceConfigs.forEach(config => {
    manager.registerSlice(config);
  });
};
```

---

## 🔌 API Interface Design

### Backend Agnostic Chat API

```typescript
// src/features/chat/types/IChatApi.ts
export interface IChatApi {
  // ============================================================================
  // AUTHENTICATION
  // ============================================================================

  /**
   * Get authentication token from wallet or OAuth
   */
  getAuthToken(): Promise<string | null>;

  // ============================================================================
  // CONVERSATIONS
  // ============================================================================

  /**
   * Get all conversations for the authenticated user
   */
  getConversations(authToken: string): Promise<Conversation[]>;

  /**
   * Create a new conversation
   */
  createConversation(authToken: string, title?: string): Promise<Conversation>;

  /**
   * Delete a conversation and all its messages
   */
  deleteConversation(authToken: string, id: string): Promise<void>;

  /**
   * Update conversation metadata (title, etc.)
   */
  updateConversation(
    authToken: string,
    id: string,
    updates: Partial<Conversation>
  ): Promise<Conversation>;

  // ============================================================================
  // MESSAGES
  // ============================================================================

  /**
   * Get all messages for a conversation
   */
  getMessages(
    authToken: string,
    conversationId: string
  ): Promise<Message[]>;

  /**
   * Stream a message response (for AI replies)
   */
  streamMessage(
    conversationId: string,
    content: string,
    authToken: string,
    options?: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
      systemPrompt?: string;
    }
  ): AsyncGenerator<MessageChunk>;

  /**
   * Send a message without streaming (for user messages)
   */
  sendMessage(
    authToken: string,
    conversationId: string,
    content: string
  ): Promise<Message>;

  /**
   * Delete a message
   */
  deleteMessage(
    authToken: string,
    messageId: string
  ): Promise<void>;

  // ============================================================================
  // SETTINGS & MODELS
  // ============================================================================

  /**
   * Get available AI models
   */
  getAvailableModels(authToken: string): Promise<AIModel[]>;

  /**
   * Get user's chat settings
   */
  getSettings(authToken: string): Promise<ChatSettings>;

  /**
   * Update user's chat settings
   */
  updateSettings(
    authToken: string,
    settings: Partial<ChatSettings>
  ): Promise<ChatSettings>;
}

// Supporting types
export interface MessageChunk {
  id: string;
  delta: string; // Incremental content
  done: boolean;
  metadata?: {
    model?: string;
    finishReason?: string;
  };
}

export interface AIModel {
  id: string;
  name: string;
  description?: string;
  contextWindow: number;
  maxTokens: number;
  pricing?: {
    input: number;  // per 1M tokens
    output: number; // per 1M tokens
  };
}

export interface ChatSettings {
  defaultModel: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  streamingEnabled: boolean;
}
```

### OpenAI Implementation Example

```typescript
// src/services/chat/OpenAIChatApi.ts
import { IChatApi, MessageChunk } from '@/features/chat/types/IChatApi';

export class OpenAIChatApi implements IChatApi {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || import.meta.env.VITE_OPENAI_API_KEY;
  }

  async getAuthToken(): Promise<string | null> {
    const state = store.getState();

    // Priority 1: Wallet signature
    if (state.wallet.account.signature) {
      return state.wallet.account.signature;
    }

    // Priority 2: OAuth token
    if (state.auth.user?.token) {
      return state.auth.user.token;
    }

    // Priority 3: Use API key directly
    return this.apiKey;
  }

  async *streamMessage(
    conversationId: string,
    content: string,
    authToken: string,
    options?: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
      systemPrompt?: string;
    }
  ): AsyncGenerator<MessageChunk> {
    const model = options?.model || 'gpt-4';

    // Build messages array (would include conversation history)
    const messages = [
      ...(options?.systemPrompt
        ? [{ role: 'system', content: options.systemPrompt }]
        : []
      ),
      { role: 'user', content },
    ];

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken || this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens || 2000,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();

    let messageId = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk
        .split('\n')
        .filter(line => line.trim() !== '' && line.trim() !== 'data: [DONE]');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            messageId = data.id;

            const delta = data.choices[0]?.delta?.content || '';
            const finishReason = data.choices[0]?.finish_reason;

            yield {
              id: messageId,
              delta,
              done: finishReason === 'stop',
              metadata: {
                model: data.model,
                finishReason,
              },
            };

          } catch (error) {
            console.error('Error parsing SSE data:', error);
          }
        }
      }
    }
  }

  async getConversations(authToken: string): Promise<Conversation[]> {
    // Implementation depends on backend
    // This might call your custom backend that stores conversations
    // For OpenAI-only setup, you'd store conversations in localStorage or DB
    throw new Error('Not implemented - requires backend');
  }

  // ... other methods
}
```

### Mock Implementation for Testing

```typescript
// src/services/chat/MockChatApi.ts
export class MockChatApi implements IChatApi {
  async getAuthToken(): Promise<string | null> {
    return 'mock-token-123';
  }

  async *streamMessage(
    conversationId: string,
    content: string,
    authToken: string
  ): AsyncGenerator<MessageChunk> {
    // Simulate streaming response
    const response = `Mock response to: ${content}`;

    for (let i = 0; i < response.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50)); // 50ms delay

      yield {
        id: `msg-${Date.now()}`,
        delta: response[i],
        done: i === response.length - 1,
      };
    }
  }

  async getConversations(): Promise<Conversation[]> {
    return [
      {
        id: 'conv-1',
        title: 'Test Conversation',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messageCount: 0,
      },
    ];
  }

  // ... other mock implementations
}
```

---

## 📝 Implementation Phases

### **Phase 1: Setup & Dependencies** (1-2 days)

#### 1.1 Package Installation

```bash
npm install \
  @assistant-ui/react \
  @assistant-ui/react-markdown \
  lucide-react \
  remark-gfm \
  class-variance-authority \
  clsx
```

**Note**: We'll evaluate if Tailwind CSS is needed. If we go with Option A (Mantine-only styling), we might skip Tailwind entirely.

#### 1.2 Feature Structure Setup

Tasks:
- [ ] Create `src/features/chat/` directory structure
- [ ] Setup basic TypeScript interfaces in `src/features/chat/types/`
- [ ] Configure path aliases in `tsconfig.json` if needed
- [ ] Create placeholder files for models, components, hooks

#### 1.3 Optional: Minimal Tailwind Configuration

If using assistant-ui default components:

```js
// tailwind.config.js - Minimal config just for assistant-ui
export default {
  content: ['./src/features/chat/**/*.{ts,tsx}'],
  prefix: 'aui-', // Prevent conflicts with Mantine
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Decision Point**: After Phase 1, decide whether to use assistant-ui components with Tailwind or build fully custom Mantine components.

---

### **Phase 2: Core Models & State** (2-3 days)

#### 2.1 Redux Slices

Create slices following the existing pattern (see blog-demo for reference):

**Files to create:**
- `src/features/chat/models/conversation/slice.ts`
- `src/features/chat/models/conversation/actions.ts`
- `src/features/chat/models/conversation/types/`
- `src/features/chat/models/message/slice.ts`
- `src/features/chat/models/message/actions.ts`
- `src/features/chat/models/message/types/`
- `src/features/chat/models/settings/slice.ts`
- `src/features/chat/models/settings/actions.ts`

**Key actions to implement:**
- `sendMessage` - User sends a message
- `appendMessageChunk` - Streaming chunk received
- `finalizeMessage` - Streaming complete
- `loadConversations` - Load conversation list
- `createConversation` - New conversation
- `deleteConversation`
- `updateSettings`

#### 2.2 Redux Sagas

**Files to create:**
- `src/features/chat/sagas.ts`
- `src/features/chat/models/message/actionEffects/SendMessage.ts`
- `src/features/chat/models/conversation/actionEffects/LoadConversations.ts`

**Saga patterns to implement:**
- Streaming channel for real-time message updates
- Error handling and retry logic
- Auth token injection
- Optimistic updates

#### 2.3 SliceLifecycleManager Integration

**File to create:**
- `src/features/chat/configureChat.ts`

Register chat feature with appropriate cleanup strategies.

#### 2.4 Root Reducer Update

```typescript
// src/store/rootReducer.ts
import { chatReducer } from '@/features/chat/slice';

export default combineReducers({
  wallet: walletReducer,
  auth: authReducer,
  blogDemo: blogDemoReducer,
  chat: chatReducer, // ← ADD THIS
});
```

#### 2.5 Root Saga Update

```typescript
// src/store/rootSaga.ts
import { watchChatSaga } from '@/features/chat/sagas';

export function* rootSaga() {
  yield all([
    fork(watchWalletSaga, walletApi),
    fork(watchBlogDemoSaga, blogDemoApi),
    fork(watchChatSaga, chatApi), // ← ADD THIS
  ]);
}
```

---

### **Phase 3: API Integration** (2-3 days)

#### 3.1 Chat API Interface

**File to create:**
- `src/features/chat/types/IChatApi.ts` (complete interface definition)

#### 3.2 Mock Implementation

**File to create:**
- `src/services/chat/MockChatApi.ts`

Purpose: Test the entire chat flow without a real backend. Simulates streaming, delays, errors.

#### 3.3 OpenAI Implementation

**File to create:**
- `src/services/chat/OpenAIChatApi.ts`

Features:
- Streaming API support
- Error handling
- Retry logic
- Auth token injection

#### 3.4 Auth Token Provider

Integrate with existing auth system:

```typescript
// src/features/chat/hooks/useChatAuth.ts
export const useChatAuth = () => {
  const walletAccount = useSelector((state: RootState) => state.wallet.account);
  const authUser = useSelector((state: RootState) => state.auth.user);

  const getAuthToken = useCallback(async (): Promise<string | null> => {
    // Priority 1: Wallet signature
    if (walletAccount.signature) {
      return walletAccount.signature;
    }

    // Priority 2: OAuth token
    if (authUser?.token) {
      return authUser.token;
    }

    return null;
  }, [walletAccount, authUser]);

  return { getAuthToken };
};
```

---

### **Phase 4: assistant-ui Runtime Integration** (2-3 days)

#### 4.1 Custom Runtime Adapter

**File to create:**
- `src/features/chat/runtime/ReduxChatRuntime.ts`

Purpose: Bridge between assistant-ui's LocalRuntime and Redux state.

```typescript
import { LocalRuntime } from '@assistant-ui/react';

export class ReduxChatRuntime extends LocalRuntime {
  constructor(
    private chatApi: IChatApi,
    private dispatch: Dispatch,
    private getState: () => RootState
  ) {
    super({
      adapters: {
        // Configure assistant-ui adapters
      },
    });
  }

  // Override methods to sync with Redux
}
```

#### 4.2 Runtime Provider Setup

**File to create:**
- `src/features/chat/runtime/ChatRuntimeProvider.tsx`

```typescript
import { AssistantRuntimeProvider } from '@assistant-ui/react';

export const ChatRuntimeProvider: FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useDispatch();
  const chatApi = useMemo(() => new OpenAIChatApi(), []);

  const runtime = useMemo(
    () => new ReduxChatRuntime(chatApi, dispatch, store.getState),
    [chatApi, dispatch]
  );

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
};
```

#### 4.3 Sync Hooks

**Files to create:**
- `src/features/chat/hooks/useSyncAssistantToRedux.ts`
- `src/features/chat/hooks/useSyncReduxToAssistant.ts`

Purpose: Keep assistant-ui and Redux in sync bidirectionally.

---

### **Phase 5: UI Components (Mantine-styled)** (3-4 days)

#### 5.1 Base Components

**Message Bubble**
```typescript
// src/features/chat/components/ChatMessage/ChatMessage.tsx
// - User vs Assistant styling
// - Timestamp
// - Avatar (wallet identicon or user photo)
// - Message actions (copy, edit, delete)
```

**Chat Input**
```typescript
// src/features/chat/components/ChatInput/ChatInput.tsx
// - Mantine TextInput/Textarea
// - Send button
// - File attachment button
// - Character/token counter
// - Auto-resize
```

**Conversation List**
```typescript
// src/features/chat/components/ConversationList/ConversationList.tsx
// - List of conversations
// - Active conversation highlight
// - New conversation button
// - Delete/rename actions
```

#### 5.2 Layout Components

**Main Chat Interface**
```typescript
// src/features/chat/components/ChatInterface/ChatInterface.tsx
// - Split layout: sidebar + chat area
// - Responsive design
// - Empty state
```

**Sidebar**
```typescript
// src/features/chat/components/ChatSidebar/ChatSidebar.tsx
// - Conversation list
// - New chat button
// - Settings button
// - Collapsible on mobile
```

**Message List**
```typescript
// src/features/chat/components/MessageList/MessageList.tsx
// - Scrollable message container
// - Auto-scroll to bottom
// - Virtualization for performance (react-window)
```

#### 5.3 Markdown Rendering

```typescript
// src/features/chat/components/MessageContent/MessageContent.tsx
// - Markdown parsing (remark-gfm)
// - Syntax highlighting (prism-react-renderer)
// - Code copy button
// - Tables, lists, etc.
```

#### 5.4 Streaming Indicator

```typescript
// src/features/chat/components/TypingIndicator/TypingIndicator.tsx
// - Animated dots
// - "Assistant is typing..." message
```

---

### **Phase 6: Advanced Features** (2-3 days)

#### 6.1 File Upload

```typescript
// src/features/chat/components/FileUpload/FileUpload.tsx
// - Drag & drop
// - File preview
// - Image upload
// - File size validation
// - Multiple file support
```

#### 6.2 Settings Panel

```typescript
// src/features/chat/components/ChatSettings/ChatSettings.tsx
// - Model selection dropdown
// - Temperature slider
// - Max tokens input
// - System prompt textarea
// - Streaming toggle
```

#### 6.3 Conversation Management

```typescript
// src/features/chat/components/ConversationActions/
// - ConversationMenu.tsx - Context menu
// - RenameDialog.tsx - Rename conversation
// - DeleteDialog.tsx - Confirm delete
```

#### 6.4 Message Actions

```typescript
// src/features/chat/components/MessageActions/MessageActions.tsx
// - Copy to clipboard
// - Edit message (user messages only)
// - Regenerate response (assistant messages)
// - Delete message
```

---

### **Phase 7: Routing & Navigation** (1 day)

#### 7.1 Chat Routes

**Files to create:**
- `src/pages/Chat/ChatPage.tsx`
- `src/pages/Chat/ConversationPage.tsx`

**Route configuration:**
```typescript
// src/features/router/config.ts
{
  path: '/chat',
  element: <ChatPage />,
  children: [
    {
      path: '',
      element: <ChatEmptyState />
    },
    {
      path: ':conversationId',
      element: <ConversationPage />
    }
  ]
}
```

#### 7.2 Navigation Integration

Add chat link to main navigation:

```typescript
// src/features/ui/mantine/Layout/components/LayoutNavbar.tsx
<NavLink
  to="/chat"
  label={t('nav.chat')}
  leftSection={<IconMessageCircle />}
/>
```

---

### **Phase 8: Testing** (2-3 days)

#### 8.1 Unit Tests

**Redux tests:**
- `src/features/chat/models/conversation/slice.test.ts`
- `src/features/chat/models/message/slice.test.ts`
- `src/features/chat/models/settings/slice.test.ts`

Test: Reducers, actions, selectors, state transitions

#### 8.2 Saga Tests

**Files:**
- `src/features/chat/sagas.test.ts`
- `src/features/chat/models/message/actionEffects/SendMessage.test.ts`

Use `redux-saga-test-plan` for saga testing.

Test:
- Streaming flow
- Error handling
- Auth token injection
- Optimistic updates

#### 8.3 Component Tests

**Files:**
- `src/features/chat/components/ChatMessage/ChatMessage.test.tsx`
- `src/features/chat/components/ChatInput/ChatInput.test.tsx`
- `src/features/chat/components/ConversationList/ConversationList.test.tsx`

Use React Testing Library.

Test:
- Rendering
- User interactions
- Accessibility

#### 8.4 Integration Tests

**File:**
- `src/features/chat/__tests__/chat-flow.test.tsx`

Test complete flow:
1. Create conversation
2. Send message
3. Receive streaming response
4. Delete message
5. Delete conversation

---

### **Phase 9: Storybook & Documentation** (1-2 days)

#### 9.1 Storybook Stories

Create stories for all components:
```typescript
// src/features/chat/components/ChatMessage/ChatMessage.stories.tsx
// src/features/chat/components/ChatInput/ChatInput.stories.tsx
// src/features/chat/components/ChatInterface/ChatInterface.stories.tsx
// ... etc
```

#### 9.2 Documentation

**Files to create:**
- `docs/features/chat.md` - User guide
- `docs/api/chat-api.md` - API integration guide
- `docs/customization/chat-theming.md` - Theming guide

**Content:**
- Setup instructions
- API integration examples (OpenAI, Anthropic, custom)
- Customization guide
- Troubleshooting

---

### **Phase 10: Polish & Optimization** (1-2 days)

#### 10.1 Performance Optimization

Tasks:
- [ ] Implement message virtualization (react-window) for long conversations
- [ ] Optimize re-renders with useMemo/useCallback
- [ ] Lazy load heavy components (markdown editor, file upload)
- [ ] Throttle streaming updates (100ms)
- [ ] Code splitting for chat feature

#### 10.2 Accessibility

Tasks:
- [ ] Add ARIA labels to all interactive elements
- [ ] Implement keyboard navigation (Tab, Enter, Escape)
- [ ] Screen reader announcements for new messages
- [ ] Focus management (input auto-focus, modal trapping)
- [ ] Color contrast compliance (WCAG AA)

#### 10.3 Error Handling

Tasks:
- [ ] Network error recovery (auto-retry)
- [ ] Stream interruption handling
- [ ] Graceful degradation (no auth, no backend)
- [ ] User-friendly error messages
- [ ] Error boundaries

#### 10.4 Internationalization

**Files to create:**
- `src/features/chat/translations/en-US/Chat.json`
- `src/features/chat/translations/tr-TR/Chat.json`

**Keys to add:**
```json
{
  "chat.title": "Chat",
  "chat.newConversation": "New Conversation",
  "chat.sendMessage": "Send message",
  "chat.inputPlaceholder": "Type your message...",
  "chat.typingIndicator": "Assistant is typing...",
  "chat.deleteConfirm": "Delete this conversation?",
  "chat.error.network": "Network error. Please try again.",
  "chat.error.auth": "Authentication required.",
  "chat.settings.title": "Chat Settings",
  "chat.settings.model": "Model",
  "chat.settings.temperature": "Temperature",
  "chat.settings.maxTokens": "Max Tokens",
  "chat.settings.systemPrompt": "System Prompt"
}
```

---

## ⚠️ Potential Challenges & Solutions

### 1. assistant-ui Runtime vs Redux Synchronization

**Challenge**: assistant-ui has its own state management, needs sync with Redux.

**Solution**:
```typescript
// Custom hooks to sync
export const useSyncAssistantToRedux = () => {
  const messages = useThreadMessages(); // assistant-ui hook
  const dispatch = useDispatch();

  useEffect(() => {
    // Sync assistant-ui messages to Redux
    dispatch(syncMessages(messages));
  }, [messages, dispatch]);
};
```

### 2. Streaming Performance

**Challenge**: Very fast streaming updates can slow down UI.

**Solution**:
```typescript
// Throttle updates
import { throttle } from 'lodash';

const throttledUpdate = throttle((message) => {
  dispatch(updateMessage(message));
}, 100); // 100ms throttle
```

### 3. Mantine + Tailwind CSS Conflicts

**Challenge**: assistant-ui uses Tailwind, project uses Mantine.

**Solution**:
- Option A: Isolate Tailwind with `aui-` prefix
- Option B (Recommended): Don't use assistant-ui components, only runtime. Build all UI with Mantine.

### 4. Auth Token Management

**Challenge**: Wallet signature vs OAuth token - which to use when?

**Solution**:
```typescript
// Priority-based token provider
async getAuthToken(): Promise<string | null> {
  // 1. Check wallet auth (dApp-specific use case)
  if (walletConnected && chatRequiresWalletAuth) {
    return walletSignature;
  }

  // 2. Check OAuth (traditional web app)
  if (oauthToken) {
    return oauthToken;
  }

  // 3. Guest mode (if backend supports it)
  return null;
}
```

### 5. Message History Persistence

**Challenge**: Where to store conversation history?

**Solution**:
```typescript
// Three-tier storage strategy
// 1. Runtime: assistant-ui (ephemeral)
// 2. Redux: Current session (in-memory)
// 3. Backend/localStorage: Long-term persistence

// On app load
useEffect(() => {
  const loadPersistedConversations = async () => {
    // Load from backend or localStorage
    const conversations = await chatApi.getConversations();
    dispatch(setConversations(conversations));
  };
  loadPersistedConversations();
}, []);

// On message send
useEffect(() => {
  // Sync to backend
  if (newMessage) {
    chatApi.saveMessage(newMessage);
  }
}, [newMessage]);
```

### 6. Long Conversation Performance

**Challenge**: Rendering hundreds of messages can be slow.

**Solution**:
```typescript
// Use react-window for virtualization
import { VariableSizeList } from 'react-window';

export const MessageList = () => {
  return (
    <VariableSizeList
      height={600}
      itemCount={messages.length}
      itemSize={index => getMessageHeight(messages[index])}
    >
      {({ index, style }) => (
        <div style={style}>
          <ChatMessage message={messages[index]} />
        </div>
      )}
    </VariableSizeList>
  );
};
```

### 7. Backend Agnostic Implementation

**Challenge**: Need to support multiple backends (OpenAI, Anthropic, custom).

**Solution**:
```typescript
// Factory pattern for API creation
export const createChatApi = (
  provider: 'openai' | 'anthropic' | 'custom',
  config: ApiConfig
): IChatApi => {
  switch (provider) {
    case 'openai':
      return new OpenAIChatApi(config.apiKey);
    case 'anthropic':
      return new AnthropicChatApi(config.apiKey);
    case 'custom':
      return new CustomChatApi(config.baseUrl, config.headers);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
};

// Usage
const chatApi = createChatApi(
  import.meta.env.VITE_CHAT_PROVIDER,
  { apiKey: import.meta.env.VITE_CHAT_API_KEY }
);
```

---

## 📊 Time Estimates

| Phase | Duration | Description |
|-------|----------|-------------|
| Phase 1: Setup | 1-2 days | Dependencies, structure |
| Phase 2: State | 2-3 days | Redux slices, sagas |
| Phase 3: API | 2-3 days | Interface, implementations |
| Phase 4: Runtime | 2-3 days | assistant-ui integration |
| Phase 5: UI | 3-4 days | Mantine components |
| Phase 6: Features | 2-3 days | File upload, settings |
| Phase 7: Routing | 1 day | Routes, navigation |
| Phase 8: Testing | 2-3 days | Unit, saga, component tests |
| Phase 9: Docs | 1-2 days | Storybook, documentation |
| Phase 10: Polish | 1-2 days | Performance, a11y, i18n |
| **TOTAL** | **17-26 days** | ~3-5 weeks (single developer) |

**Notes:**
- Estimates assume 1 full-time developer
- May vary based on backend complexity
- Testing time depends on coverage requirements
- Add buffer for bug fixes and refinements

---

## ✅ Success Criteria

Before considering the implementation complete, verify:

**Core Functionality:**
- [ ] ✅ Streaming chat responses working
- [ ] ✅ Conversation creation, deletion, renaming
- [ ] ✅ Message history persistence
- [ ] ✅ Multiple conversation support

**Authentication:**
- [ ] ✅ Wallet authentication integrated
- [ ] ✅ OAuth authentication (Google) integrated
- [ ] ✅ Guest mode supported (if applicable)

**UI/UX:**
- [ ] ✅ Markdown rendering with code highlighting
- [ ] ✅ File/image upload supported
- [ ] ✅ Mobile responsive design
- [ ] ✅ Typing indicator during streaming
- [ ] ✅ Message actions (copy, delete, regenerate)

**Accessibility:**
- [ ] ✅ WCAG AA compliance
- [ ] ✅ Keyboard navigation
- [ ] ✅ Screen reader support
- [ ] ✅ ARIA labels on interactive elements

**Internationalization:**
- [ ] ✅ Turkish (TR) translations complete
- [ ] ✅ English (EN) translations complete
- [ ] ✅ Language switching works

**Quality:**
- [ ] ✅ %80+ test coverage
- [ ] ✅ All Storybook stories created
- [ ] ✅ `npm run lint` - 0 warnings
- [ ] ✅ `npm run test` - All passing
- [ ] ✅ `npm run build` - Success
- [ ] ✅ No console errors in dev/prod

**Documentation:**
- [ ] ✅ README updated with chat feature docs
- [ ] ✅ API integration guide written
- [ ] ✅ Customization/theming guide written

---

## 🚀 Next Steps

### Immediate Actions

1. **Review & Approve Plan**
   - Review this plan with team/stakeholders
   - Address any questions or concerns
   - Get approval to proceed

2. **Make Key Decisions**
   - **Backend**: Which AI provider? (OpenAI, Anthropic, custom?)
   - **Styling**: Full Mantine rebuild or use assistant-ui components?
   - **Auth**: Required or optional? Guest mode?

3. **Setup Development Environment**
   - Create feature branch: `feature/chat-module`
   - Install initial dependencies
   - Setup development tools

4. **Begin Phase 1**
   - Create directory structure
   - Setup basic types
   - Install packages

### Questions to Answer Before Starting

1. **Backend Provider**
   - Are we using OpenAI, Anthropic, or a custom backend?
   - Do we have API keys ready?
   - Do we need to build a backend service first?

2. **Authentication Requirements**
   - Is chat authentication required or optional?
   - Should we support guest mode (unauthenticated chat)?
   - How do we handle auth token refresh?

3. **Data Persistence**
   - Where do we store conversation history?
   - Do we need a backend database or is localStorage sufficient?
   - How long should we cache conversations?

4. **Scope Adjustments**
   - Are there any features we want to add/remove?
   - Any specific AI models we want to support?
   - Any specific file types for upload?

---

## 📚 References

### Official Documentation
- **assistant-ui**: https://www.assistant-ui.com
- **assistant-ui GitHub**: https://github.com/assistant-ui/assistant-ui
- **Mantine**: https://mantine.dev
- **Redux Toolkit**: https://redux-toolkit.js.org
- **Redux Saga**: https://redux-saga.js.org

### Related Issues
- **Original Issue**: #68 - Add Chat Module

### Internal Documentation
- `CLAUDE.md` - Project coding guidelines
- `docs/architecture/slice-manager.md` - SliceLifecycleManager guide
- `src/features/blog-demo/` - Reference implementation

---

## 📝 Notes

- This plan is a living document and may be updated as implementation progresses
- Time estimates are approximate and may vary
- Each phase should be completed and tested before moving to the next
- Regular code reviews recommended after each phase
- Consider breaking large PRs into smaller ones for easier review

---

**Plan Version**: 1.0
**Last Updated**: 2025-10-19
**Status**: 📋 Planning Phase
