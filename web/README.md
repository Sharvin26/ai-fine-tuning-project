# Web Module - AI Chatbot Interface

A modern Next.js 15 application that provides a chat interface for interacting with your fine-tuned OpenAI model. Built with TypeScript, Tailwind CSS, and the Vercel AI SDK for streaming responses.

## Features

- 💬 Real-time chat interface with streaming responses
- 🎨 Modern UI with Radix UI components and Tailwind CSS
- 🔄 Message history management
- ⚡ Fast response times with edge functions
- 🎯 Type-safe with full TypeScript support
- 📱 Responsive design for all devices

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **AI Integration**: Vercel AI SDK, OpenAI SDK
- **UI Components**: Radix UI, Lucide Icons
- **State Management**: React Hooks (useChat)

## Project Structure

```
web/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/         # Chat API endpoint
│   │   │       └── route.ts  # OpenAI integration
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page with chat
│   ├── components/
│   │   ├── ui/               # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   └── avatar.tsx
│   │   └── chat.tsx          # Main chat component
│   ├── lib/
│   │   └── utils.ts          # Utility functions
│   └── types/
│       └── chat.ts           # TypeScript types
├── public/                   # Static assets
├── components.json           # UI components config
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json             # TypeScript config
└── package.json              # Dependencies
```

## Getting Started

### Prerequisites

- Node.js 22.0 or later
- npm
- OpenAI API key

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:

   Create a `.env.local` file in the web directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_ORG_ID=your_organization_id_here
   FINE_TUNED_MODEL=your_fine_tuned_model_id_here
   ```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your chatbot.

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `.next` directory.

### Running Production Build

```bash
npm run start
```

## Key Components

### Chat Component (`src/components/chat.tsx`)
- Manages chat state using Vercel AI SDK's `useChat` hook
- Handles message sending, streaming responses
- Provides typing indicators and error handling
- Auto-scrolls to latest messages

### API Route (`src/app/api/chat/route.ts`)
- Integrates with OpenAI API
- Adds system prompt to prevent hallucination
- Streams responses back to the client
- Handles error cases gracefully

## Customization

### Changing the System Prompt

Edit the system prompt in `src/app/api/chat/route.ts` (around line 32):

```typescript
const systemPrompt = {
    role: "system" as const,
    content: `Your custom system prompt here...`
};
```

### Styling

- Global styles: `src/app/globals.css`
- Tailwind config: `tailwind.config.ts`
- Component variants: Using CVA (class-variance-authority)

### Adding Features

Common extensions:
- Add message persistence (database/localStorage)
- Implement user authentication
- Add conversation management
- Export chat history
- Add voice input/output
- Implement message reactions

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Run production build
- `npm run lint` - Run ESLint

## Troubleshooting

### Common Issues

1. **"Invalid API Key" error**
   - Verify your OpenAI API key in `.env.local`
   - Ensure the key has access to the fine-tuned model

2. **Model not found**
   - Check that the model ID in `route.ts` matches your fine-tuned model
   - Verify your API key has access to the model

3. **Streaming not working**
   - Ensure you're using the latest version of the AI SDK
   - Check browser console for WebSocket errors

4. **Build errors**
   - Clear `.next` directory and rebuild
   - Ensure all dependencies are installed

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- AWS Amplify
- Netlify
- Railway
- Docker containers

## Back to Main Documentation

[← Back to Project Root](../README.md)