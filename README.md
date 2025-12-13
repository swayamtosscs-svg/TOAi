# TOAI - Modern AI Chat Application

A beautiful, modern AI chat interface built with React, TypeScript, and Tailwind CSS.

## Features

- 🎨 **Modern UI Design**: Clean, minimal interface with soft gradients and smooth animations
- 🌓 **Dark/Light Mode**: Seamless theme switching
- 💬 **Chat Interface**: Rounded message bubbles with hover actions (copy, regenerate)
- ⌨️ **Smart Input**: Auto-resizing textarea with keyboard shortcuts
- 🎭 **Micro-interactions**: Smooth animations and transitions throughout
- 🎯 **Unique Branding**: Custom TOAI logo and gradient color scheme

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Design Highlights

- **Color Scheme**: Teal, violet, and cyan gradient accents
- **Typography**: Inter font family for modern readability
- **Layout**: Left sidebar with chat history, centered main chat area
- **Interactions**: Hover effects, typing indicators, smooth scrolling

## Project Structure

```
src/
├── components/
│   ├── Sidebar.tsx          # Left sidebar with logo, history, settings
│   ├── ChatInterface.tsx    # Main chat area container
│   ├── MessageBubble.tsx    # Individual message component
│   ├── ChatInput.tsx        # Message input with send button
│   ├── TypingIndicator.tsx  # Animated typing indicator
│   └── Logo.tsx             # TOAI logo component
├── App.tsx                  # Main application component
├── main.tsx                 # Application entry point
├── types.ts                 # TypeScript type definitions
└── index.css                # Global styles and Tailwind imports
```

## License

MIT

