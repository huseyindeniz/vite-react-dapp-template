import { ChatModelRunOptions, ChatModelRunResult } from '@assistant-ui/react';
import log from 'loglevel';

import { IChatModelAdapter } from '@/domain/features/ai-assistant/interfaces/IChatModelAdapter';
import { AgentType } from '@/domain/features/ai-assistant/types/AgentType';

import { CompleteStatus } from './types/CompleteStatus';
import { ImageContent } from './types/ImageContent';
import { IncompleteStatus } from './types/IncompleteStatus';
import { TextContent } from './types/TextContent';

/**
 * Demo chat adapter that showcases chat capabilities without requiring a real AI backend
 * Provides funny, helpful responses demonstrating streaming, markdown, and code formatting
 */
export class DemoChatModelAdapter implements IChatModelAdapter {
  readonly type: AgentType = 'demo';

  async *run(options: ChatModelRunOptions): AsyncGenerator<ChatModelRunResult> {
    const { messages } = options;

    try {
      const lastUserMessage = messages
        .slice()
        .reverse()
        .find(msg => msg.role === 'user');

      if (!lastUserMessage || lastUserMessage.role !== 'user') {
        throw new Error('No user message found');
      }

      const userMessageText = lastUserMessage.content
        .filter(part => part.type === 'text')
        .map(part => (part.type === 'text' ? part.text : ''))
        .join('\n')
        .toLowerCase();

      log.debug('Demo agent processing message:', userMessageText);

      // Select response based on user input
      const response = this.selectResponse(userMessageText);

      // Handle different response types
      if (response.type === 'text') {
        // Simulate streaming response
        yield* this.streamResponse(response.content);

        const textContent: TextContent = {
          type: 'text',
          text: response.content,
        };

        const completeStatus: CompleteStatus = {
          type: 'complete',
          reason: 'stop',
        };

        return {
          content: [textContent],
          status: completeStatus,
        };
      }

      // Handle artifact responses
      if (response.type === 'image') {
        const introText = this.getRandomItem(IMAGE_INTRO_RESPONSES);
        yield* this.streamResponse(introText);

        const imageData = this.generateImageArtifact();

        const textContent: TextContent = {
          type: 'text',
          text: introText,
        };

        const imageContent: ImageContent = {
          type: 'image',
          image: imageData,
        };

        const completeStatus: CompleteStatus = {
          type: 'complete',
          reason: 'stop',
        };

        // Yield the artifact
        yield {
          content: [textContent, imageContent],
        };

        return {
          content: [textContent, imageContent],
          status: completeStatus,
        };
      }

      if (response.type === 'markdown') {
        const introText = this.getRandomItem(MARKDOWN_INTRO_RESPONSES);
        yield* this.streamResponse(introText);

        const markdownFile = this.generateMarkdownArtifact();

        const textContent: TextContent = {
          type: 'text',
          text: introText,
        };

        const completeStatus: CompleteStatus = {
          type: 'complete',
          reason: 'stop',
        };

        // Yield the artifact
        yield {
          content: [
            textContent,
            {
              type: 'file',
              ...markdownFile,
            },
          ],
        };

        return {
          content: [
            textContent,
            {
              type: 'file',
              ...markdownFile,
            },
          ],
          status: completeStatus,
        };
      }

      if (response.type === 'json') {
        const introText = this.getRandomItem(JSON_INTRO_RESPONSES);
        yield* this.streamResponse(introText);

        const jsonFile = this.generateJsonArtifact();

        const textContent: TextContent = {
          type: 'text',
          text: introText,
        };

        const completeStatus: CompleteStatus = {
          type: 'complete',
          reason: 'stop',
        };

        // Yield the artifact
        yield {
          content: [
            textContent,
            {
              type: 'file',
              ...jsonFile,
            },
          ],
        };

        return {
          content: [
            textContent,
            {
              type: 'file',
              ...jsonFile,
            },
          ],
          status: completeStatus,
        };
      }

      if (response.type === 'csv') {
        const introText = this.getRandomItem(CSV_INTRO_RESPONSES);
        yield* this.streamResponse(introText);

        const csvFile = this.generateCsvArtifact();

        const textContent: TextContent = {
          type: 'text',
          text: introText,
        };

        const completeStatus: CompleteStatus = {
          type: 'complete',
          reason: 'stop',
        };

        // Yield the artifact
        yield {
          content: [
            textContent,
            {
              type: 'file',
              ...csvFile,
            },
          ],
        };

        return {
          content: [
            textContent,
            {
              type: 'file',
              ...csvFile,
            },
          ],
          status: completeStatus,
        };
      }

      // Fallback
      const completeStatusFallback: CompleteStatus = {
        type: 'complete',
        reason: 'stop',
      };

      return {
        content: [],
        status: completeStatusFallback,
      };
    } catch (error) {
      log.error('DemoChatModelAdapter error:', error);

      const incompleteStatus: IncompleteStatus = {
        type: 'incomplete',
        reason: 'error',
        error:
          error instanceof Error
            ? error.message
            : 'Demo agent error occurred',
      };

      return {
        content: [],
        status: incompleteStatus,
      };
    }
  }

  /**
   * Select appropriate response based on user input
   * Returns response type: text, image, markdown file, or data export
   */
  private selectResponse(userMessage: string): {
    type: 'text' | 'image' | 'markdown' | 'json' | 'csv';
    content: string;
  } {
    // Image artifacts
    if (
      /image|picture|show.*image|draw|create.*image|generate.*image/i.test(
        userMessage
      )
    ) {
      return { type: 'image', content: '' };
    }

    // Markdown file artifacts
    if (
      /markdown|document|create.*file|write.*file|generate.*document|make.*document/i.test(
        userMessage
      )
    ) {
      return { type: 'markdown', content: '' };
    }

    // JSON export artifacts
    if (
      /export.*json|json.*export|export.*data|generate.*json/i.test(userMessage)
    ) {
      return { type: 'json', content: '' };
    }

    // CSV export artifacts
    if (
      /export.*csv|csv.*export|generate.*csv|spreadsheet/i.test(userMessage)
    ) {
      return { type: 'csv', content: '' };
    }

    // Greeting responses
    if (/^(hi|hello|hey|greetings|yo|sup|howdy)\b/i.test(userMessage.trim())) {
      return { type: 'text', content: this.getRandomItem(GREETING_RESPONSES) };
    }

    // Help requests
    if (
      /help|what can you do|capabilities|features|how do you work/i.test(
        userMessage
      )
    ) {
      return { type: 'text', content: this.getRandomItem(HELP_RESPONSES) };
    }

    // Goodbye
    if (/^(bye|goodbye|see you|cya|farewell)\b/i.test(userMessage.trim())) {
      return { type: 'text', content: this.getRandomItem(GOODBYE_RESPONSES) };
    }

    // Code-related queries
    if (
      /code|programming|function|issue|error|typescript|javascript/i.test(
        userMessage
      )
    ) {
      return { type: 'text', content: this.getRandomItem(CODE_RESPONSES) };
    }

    // Web3/Blockchain queries
    if (
      /web3|blockchain|ethereum|wallet|crypto|dapp|smart contract/i.test(
        userMessage
      )
    ) {
      return { type: 'text', content: this.getRandomItem(WEB3_RESPONSES) };
    }

    // Random general responses for everything else
    return { type: 'text', content: this.getRandomItem(GENERAL_RESPONSES) };
  }

  /**
   * Simulate streaming response word by word
   */
  private async *streamResponse(
    text: string
  ): AsyncGenerator<ChatModelRunResult> {
    let accumulatedText = '';

    // Stream word by word for realistic typing effect
    const words = text.split(' ');

    for (let i = 0; i < words.length; i++) {
      // Add word and space (except for last word)
      accumulatedText += words[i] + (i < words.length - 1 ? ' ' : '');

      const textContent: TextContent = {
        type: 'text',
        text: accumulatedText,
      };

      yield {
        content: [textContent],
      };

      // Simulate typing delay (30-50ms per word)
      await this.delay(30 + Math.random() * 20);
    }
  }

  /**
   * Delay helper for streaming simulation
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get random item from array
   */
  private getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Generate a demo image artifact (SVG as data URL)
   */
  private generateImageArtifact(): string {
    const svg = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#grad1)" />
      <text x="200" y="130" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle">Demo Image</text>
      <text x="200" y="170" font-family="Arial, sans-serif" font-size="18" fill="white" text-anchor="middle">Generated by Agent 3</text>
      <circle cx="200" cy="220" r="30" fill="white" opacity="0.3" />
      <circle cx="170" cy="240" r="20" fill="white" opacity="0.2" />
      <circle cx="230" cy="240" r="20" fill="white" opacity="0.2" />
    </svg>`;

    // Convert SVG to data URL
    const base64 = btoa(unescape(encodeURIComponent(svg)));
    return `data:image/svg+xml;base64,${base64}`;
  }

  /**
   * Generate a demo markdown file artifact
   */
  private generateMarkdownArtifact(): {
    filename: string;
    data: string;
    mimeType: string;
  } {
    const content = this.getRandomItem(MARKDOWN_TEMPLATES);
    return {
      filename: `demo-document-${Date.now()}.md`,
      data: content,
      mimeType: 'text/markdown',
    };
  }

  /**
   * Generate a demo JSON file artifact
   */
  private generateJsonArtifact(): {
    filename: string;
    data: string;
    mimeType: string;
  } {
    const data = {
      users: [
        { id: 1, name: 'Alice', role: 'Developer', active: true },
        { id: 2, name: 'Bob', role: 'Designer', active: true },
        { id: 3, name: 'Charlie', role: 'Manager', active: false },
      ],
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      metadata: {
        source: 'Demo Agent 3',
        format: 'JSON',
        recordCount: 3,
      },
    };

    const content = JSON.stringify(data, null, 2);
    return {
      filename: `export-${Date.now()}.json`,
      data: content,
      mimeType: 'application/json',
    };
  }

  /**
   * Generate a demo CSV file artifact
   */
  private generateCsvArtifact(): {
    filename: string;
    data: string;
    mimeType: string;
  } {
    const content = `ID,Name,Department,Salary,Status
1,Alice Johnson,Engineering,95000,Active
2,Bob Smith,Design,82000,Active
3,Charlie Davis,Marketing,78000,Active
4,Diana Lee,Sales,88000,Active
5,Evan Brown,Engineering,92000,Inactive`;

    return {
      filename: `data-export-${Date.now()}.csv`,
      data: content,
      mimeType: 'text/csv',
    };
  }
}

// Response Templates - Organized by category

const GREETING_RESPONSES = [
  "Hey there! I'm **Agent 3 (Demo)** - your friendly demonstration assistant. I'm here to show you how this chat interface works!\n\nTry asking me about:\n- My capabilities\n- Web3 concepts\n- Code examples\n- Or just chat with me!\n\nWhat would you like to explore?",
  "Hello! I'm the demo agent - think of me as a preview of what you can build with this chat feature.\n\nI demonstrate:\n- **Streaming responses** (watch me type!)\n- **Markdown support** with *italic*, **bold**, and `code`\n- **Multi-turn conversations**\n- **Code blocks** with syntax highlighting\n\nWhat interests you?",
  "Greetings! I'm Agent 3, your simulated AI companion.\n\nWhile I'm not as smart as real AI agents, I can show you the chat capabilities:\n\n1. Real-time streaming\n2. Formatted responses\n3. Contextual replies\n\nGo ahead, ask me something!",
];

const HELP_RESPONSES = [
  "Great question! Here's what I can demonstrate:\n\n## Chat Features\n\n- **Streaming**: Watch responses appear in real-time\n- **Markdown**: Support for *formatting*, **emphasis**, `code`, and more\n- **Code blocks**: Perfect for sharing code snippets\n- **Lists**: Both numbered and bulleted\n- **Multi-turn**: I remember our conversation context\n\n## Try These\n\n- Ask me about Web3 or blockchain\n- Request a code example\n- Chat naturally - I'll respond contextually\n- Switch to other agents to see real AI in action!\n\nWhat interests you?",
  'I\'m designed to showcase this chat interface! Here\'s what you can do:\n\n### Features I Demonstrate\n\n1. **Streaming responses** - Text appears gradually, just like ChatGPT\n2. **Rich formatting** - Markdown, code blocks, lists\n3. **Contextual responses** - I try to understand what you\'re asking\n4. **Agent switching** - You can switch between me and real AI agents\n\n### Sample Questions\n\n```typescript\n// Ask me about:\n- "Show me a TypeScript example"\n- "What is Web3?"\n- "How do smart contracts work?"\n```\n\nGive it a try!',
];

const GOODBYE_RESPONSES = [
  "See you later! Feel free to come back anytime to explore the chat features.\n\nDon't forget to try the **real AI agents** (Agent 1 & 2) for actual intelligent conversations!",
  "Goodbye! It was fun chatting with you.\n\nRemember:\n- I'm just a **demo** to show the UI capabilities\n- The **other agents** are connected to real AI\n- You can **switch agents** anytime using the dropdown\n\nHappy building!",
  'Farewell, friend!\n\nCome back when you want to:\n- Test the chat interface\n- See markdown formatting\n- Play with the streaming feature\n\nOr better yet, try the real AI agents!',
];

const CODE_RESPONSES = [
  "Ah, a fellow developer! Let me share a cool TypeScript example:\n\n```typescript\n// Type-safe Redux action with RTK\nimport { createSlice, PayloadAction } from '@reduxjs/toolkit';\n\ninterface WalletState {\n  address: string | null;\n  balance: string;\n  isConnected: boolean;\n}\n\nconst walletSlice = createSlice({\n  name: 'wallet',\n  initialState: {\n    address: null,\n    balance: '0',\n    isConnected: false,\n  } as WalletState,\n  reducers: {\n    connectWallet: (state, action: PayloadAction<string>) => {\n      state.address = action.payload;\n      state.isConnected = true;\n    },\n  },\n});\n```\n\n**Key Points:**\n- Type-safe state management\n- Clean separation of concerns\n- Follows Redux Toolkit patterns\n\nWant to see more examples?",
  "Code time! Here's how you might use this chat adapter:\n\n```typescript\n// Custom chat adapter implementation\nimport { ChatModelAdapter } from '@assistant-ui/react';\n\nclass MyChatAdapter implements ChatModelAdapter {\n  async *run(options: ChatModelRunOptions) {\n    // Your custom logic here\n    const response = await callYourAPI(options.messages);\n    \n    // Stream the response\n    yield {\n      content: [{ type: 'text', text: response }],\n    };\n  }\n}\n```\n\n**What makes this powerful?**\n\n1. Implements standard interface\n2. Generator function for streaming\n3. Easy to swap implementations\n4. Type-safe with TypeScript\n\nPretty neat, right?",
  "Let me show you a **React hook pattern** used in this template:\n\n```typescript\n// Feature-specific hook abstraction\nexport const useWallet = () => {\n  // Uses typed selector (NOT useSelector directly!)\n  const wallet = useTypedSelector(state => state.wallet);\n  const actions = useWalletActions();\n\n  return {\n    ...wallet,\n    ...actions,\n  };\n};\n```\n\n**Why this pattern?**\n\n- Components don't know about Redux internals\n- Easy to swap state management libraries\n- Better TypeScript inference\n- Easier to test components\n\nThis is the **Component-Hook Abstraction** pattern!",
];

const WEB3_RESPONSES = [
  'Ah, Web3! Let me break it down:\n\n## What is Web3?\n\nWeb3 is the **decentralized internet** powered by blockchain technology.\n\n### Key Concepts\n\n1. **Wallets**\n   - Your identity on the blockchain\n   - Stores crypto and NFTs\n   - Signs transactions securely\n\n2. **Smart Contracts**\n   - Self-executing code on blockchain\n   - No middlemen needed\n   - Trustless and transparent\n\n3. **dApps**\n   - Decentralized applications\n   - Run on blockchain networks\n   - Users own their data\n\n### Example Flow\n\n```typescript\n// Connect wallet → Sign transaction → Interact with smart contract\nconst tx = await contract.transfer(toAddress, amount);\nawait tx.wait(); // Wait for blockchain confirmation\n```\n\nWant to know more about any specific concept?',
  "Web3 is awesome! Here's what makes it special:\n\n### Traditional Web (Web2) vs Web3\n\n| Web2 | Web3 |\n|------|------|\n| Company owns your data | You own your data |\n| Central servers | Decentralized networks |\n| Platform controls access | Permissionless access |\n| Trust the company | Trust the code |\n\n### Why dApps Matter\n\n- **Security**: Cryptographic verification\n- **Ownership**: True digital ownership\n- **Global**: No borders or restrictions\n- **Trustless**: Code, not companies\n\n### In This Template\n\nWe provide a **wallet feature** that handles:\n- Provider management (MetaMask, etc.)\n- Network switching\n- Account connection\n- Transaction signing\n\nCheck out the `/demo-wallet` page to try it!",
  'Let me explain **smart contracts** in simple terms:\n\n## Smart Contracts\n\nThink of them as:\n- **Vending machines** for the blockchain\n- Put money in → Get product out\n- No human needed!\n\n### How They Work\n\n1. **Deploy** contract to blockchain\n2. **Users interact** by sending transactions\n3. **Code executes** automatically\n4. **Results recorded** permanently\n\n### Example Contract\n\n```solidity\n// Simple voting contract\ncontract Voting {\n  mapping(bytes32 => uint256) public votes;\n  \n  function vote(bytes32 proposal) public {\n    votes[proposal] += 1;\n  }\n}\n```\n\n### Real-World Uses\n\n- DeFi (lending, trading)\n- NFT marketplaces\n- Gaming items\n- DAOs (organizations)\n\nWant to dive deeper into any topic?',
];

const GENERAL_RESPONSES = [
  "Interesting question! While I'm just a demo agent, I can tell you this:\n\n**This chat interface supports:**\n- Real-time streaming\n- Markdown formatting\n- Code syntax highlighting\n- Multi-turn conversations\n\nFor **real AI-powered responses**, switch to:\n- **Agent 1 (with LangGraph)** - Advanced AI with tool use\n- **Agent 2 (with Google ADK)** - Google's AI agent framework\n\nI'm here to show you the UI capabilities! What would you like to explore?",
  "That's an interesting thought!\n\nSince I'm a **demo agent**, I can't provide deep insights, but I can demonstrate:\n\n### Chat Features\n\n- Fast, responsive streaming\n- Structured formatting with markdown\n- Contextual responses based on your input\n- Rich text rendering\n\n### Try This\n\n1. Ask me about **code** or **Web3**\n2. Request a **code example**\n3. Switch to **real AI agents** for intelligent responses\n4. Test the **streaming** by watching text appear\n\nWhat catches your interest?",
  "You know what? That's a great question! Let me share something cool:\n\n## This Template is Built With\n\n- **Vite** - Lightning fast builds\n- **React 19** - Latest React features\n- **Mantine v7** - Beautiful UI components\n- **Redux Toolkit** - State management\n- **Redux Saga** - Side effects handling\n- **Web3** - Ethers.js v6 integration\n- **AI Chat** - Assistant UI integration\n\n### Architecture Highlights\n\n```\nComposition Root → Features → Services\n     ↓              ↓           ↓\n  Wiring       Business     Implementation\n               Logic        Details\n```\n\nClean, maintainable, and **production-ready**! Want to know more about any part?",
  "Hmm, interesting! Let me tell you what I **do** know:\n\n### I'm a Demo Agent That Shows\n\n1. **Streaming responses** - Text flows naturally\n2. **Markdown support** - *Italics*, **bold**, `code`\n3. **Code blocks** with syntax highlighting\n4. **Lists and structure** for organized content\n5. **Contextual replies** based on keywords\n\n### What I Can't Do\n\n- Real AI reasoning\n- Complex problem solving\n- Learning from conversations\n- Accessing external data\n\n### What Real Agents Can Do\n\n- Intelligent responses\n- Tool usage (web search, etc.)\n- Deep reasoning\n- Context understanding\n\nWant to try a **real AI agent**? Switch using the dropdown above!",
  "You've got me thinking! While I'm programmed with preset responses, I can share:\n\n## Fun Facts About This Chat\n\n- I have **50+ response templates**\n- Responses are chosen **randomly** for variety\n- Streaming simulates **real AI typing**\n- Everything is **markdown formatted**\n- I'm **100% client-side** - no server needed!\n\n## Building Your Own Agent\n\nIt's easy! Just:\n\n```typescript\n// 1. Create adapter\nclass MyAdapter implements IChatModelAdapter {\n  async *run(options) { /* your logic */ }\n}\n\n// 2. Register in services.ts\nchatService.registerAdapter(new MyAdapter());\n\n// 3. Add to config\nCHAT_AGENTS = {\n  'my-agent': { label: 'My Agent' }\n};\n```\n\nThat's it! Want to see more code examples?",
];

// Artifact intro responses

const IMAGE_INTRO_RESPONSES = [
  "Here's a demo image I created for you! You can download it or copy it to your clipboard.",
  "I've generated a sample image artifact. Click the download button to save it, or copy it directly!",
  'Check out this image! This demonstrates how AI agents can generate visual content.',
];

const MARKDOWN_INTRO_RESPONSES = [
  "I've created a markdown document for you! Click the filename to view it in the side panel, or download it directly.",
  "Here's a sample markdown file. Click on it to open the preview panel on the right!",
  'I generated a markdown document - click the filename to view the formatted content!',
];

const JSON_INTRO_RESPONSES = [
  "Here's a JSON data export! You can download it or copy the content to your clipboard.",
  "I've generated sample JSON data for you. Feel free to download or copy it!",
  'Check out this JSON export - perfect for data interchange and API responses!',
];

const CSV_INTRO_RESPONSES = [
  "Here's a CSV data export! Perfect for spreadsheets - download it or copy the data.",
  "I've generated a CSV file for you. Open it in Excel or any spreadsheet application!",
  'Sample CSV data ready! This format is great for data analysis and reporting.',
];

// Markdown content templates

const MARKDOWN_TEMPLATES = [
  `# Sample Project Documentation

## Overview

This is a **demo markdown document** generated by Agent 3 to showcase the artifact capabilities of this chat interface.

## Features

- **Markdown Rendering**: Full support for GitHub Flavored Markdown
- **Syntax Highlighting**: Code blocks with language-specific highlighting
- **Side Panel**: Opens in a dedicated preview panel
- **Download & Copy**: Both actions supported

## Code Example

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const createUser = (data: User): Promise<User> => {
  return fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(data),
  }).then(res => res.json());
};
\`\`\`

## Architecture

This template follows a **three-layer architecture**:

1. **Composition Root** - Wiring and configuration
2. **Feature Layer** - Business logic and models
3. **Service Layer** - Implementation details

## Next Steps

- Explore the codebase structure
- Read CLAUDE.md for architectural guidelines
- Try the demo features
- Build your own domain features

---

*Generated by Demo Agent 3*`,

  `# Web3 dApp Development Guide

## Introduction

Welcome to the world of **decentralized applications**! This guide covers the essentials of building modern Web3 applications.

## Key Concepts

### 1. Blockchain Basics

- **Immutable Ledger**: Data cannot be changed once written
- **Decentralization**: No central authority
- **Consensus**: Network agreement on state
- **Smart Contracts**: Self-executing code

### 2. Wallet Integration

\`\`\`typescript
// Connect to wallet
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const address = await signer.getAddress();

// Sign message
const signature = await signer.signMessage('Hello Web3!');
\`\`\`

### 3. Smart Contract Interaction

\`\`\`solidity
// Simple ERC20 token
contract SimpleToken {
  mapping(address => uint256) public balances;

  function transfer(address to, uint256 amount) public {
    require(balances[msg.sender] >= amount);
    balances[msg.sender] -= amount;
    balances[to] += amount;
  }
}
\`\`\`

## Best Practices

1. **Security First**: Always validate input and handle errors
2. **Gas Optimization**: Minimize transaction costs
3. **User Experience**: Provide clear feedback and confirmations
4. **Testing**: Comprehensive test coverage is essential

## Resources

- [Ethereum Docs](https://ethereum.org)
- [Ethers.js](https://docs.ethers.org)
- [OpenZeppelin](https://openzeppelin.com)

---

*Happy building!*`,

  `# TypeScript Best Practices

## Type Safety

TypeScript's main advantage is **compile-time type checking**. Use it wisely!

### Do's and Don'ts

✅ **DO**: Define explicit interfaces

\`\`\`typescript
interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}
\`\`\`

❌ **DON'T**: Use the "any" type (disables type checking)

\`\`\`typescript
// Bad - loses all type safety
function processData(input: unknown) {
  return input; // No validation
}

// Good - proper type checking
interface ApiResponse {
  status: number;
  data: unknown;
}
const response: ApiResponse = fetchData();
\`\`\`

## Generic Types

Generics provide **reusable, type-safe** code:

\`\`\`typescript
function wrapInArray<T>(value: T): T[] {
  return [value];
}

const numbers = wrapInArray(42); // number[]
const strings = wrapInArray('hello'); // string[]
\`\`\`

## Utility Types

TypeScript provides powerful utility types:

\`\`\`typescript
type User = {
  id: number;
  name: string;
  email: string;
  password: string;
};

// Pick specific properties
type PublicUser = Pick<User, 'id' | 'name'>;

// Make all properties optional
type PartialUser = Partial<User>;

// Make all properties readonly
type ImmutableUser = Readonly<User>;
\`\`\`

## Conclusion

TypeScript is a powerful tool for building **maintainable, scalable** applications.

---

*Keep typing safely!*`,
];
