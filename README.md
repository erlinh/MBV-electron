# MBV-Electron: Message → Backend → View Architecture

This project is a reference implementation of the Message → Backend → View (MBV) architecture pattern for Electron applications using TypeScript, React, and Zustand.

## Architecture Overview

The MBV architecture pattern is designed to create maintainable and predictable applications with clear separation of concerns and unidirectional data flow. It consists of three main components:

1. **Message System**: Explicit message-based communication between UI and backend logic
2. **Backend**: Pure business logic handlers that process messages and return results
3. **View**: Passive UI components that emit messages and render state

## Key Features

- **Unidirectional Data Flow**: Clear path of data changes
- **Message-based Architecture**: Explicit communication between components
- **Clean Separation of Concerns**: UI knows nothing about business logic implementation
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Development Tools**: Message inspector, hot reloading, OpenAPI documentation
- **Dual Transport Layer**: IPC for production, HTTP API for development

## Project Structure

```
/mbv-electron
├── src/
│   ├── main/                   # Electron main process (Backend)
│   │   ├── handlers/           # Command & Query handlers
│   │   ├── persistence/        # Data storage
│   │   ├── api/                # HTTP API (dev mode)
│   │   ├── ipc/                # IPC setup
│   │   └── middleware/         # Backend middleware
│   ├── renderer/               # Electron renderer process (View)
│   │   ├── components/         # React components
│   │   ├── store/              # Zustand store
│   │   ├── messageBus/         # Client for sending messages
│   │   └── hooks/              # Custom React hooks
│   └── shared/                 # Shared between processes
│       ├── commands/           # Command types/interfaces
│       ├── queries/            # Query types/interfaces
│       ├── models/             # Shared data models
│       └── utils/              # Shared utilities
├── tools/                      # Development tools
├── electron.js                 # Electron entry point
├── package.json
└── README.md
```

## Message Flow

1. User interaction triggers an action in a React component
2. The component uses the store to emit a message (command or query)
3. The message is transported to the backend via IPC (or HTTP in dev mode)
4. The backend registers handlers for specific message types
5. Handlers process messages and return results
6. The result is sent back to the client
7. The store updates its state based on the result
8. React components re-render with the new state

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/mbv-electron.git
cd mbv-electron

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build
```

## Development Features

- **Hot Reloading**: Both frontend and backend support hot reloading
- **Message Inspector**: View all messages and responses during development
- **HTTP API**: Test the backend independently using standard HTTP tools
- **OpenAPI Documentation**: Auto-generated API docs available in dev mode

## License

MIT
