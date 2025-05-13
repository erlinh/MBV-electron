// Base message type for all messages in the system
export interface Message {
  type: string;
  payload: unknown;
}

// Base interface for message handlers
export interface MessageHandler<TMessage extends Message, TResult> {
  handle(message: TMessage): Promise<TResult>;
}

// Middleware interface for processing messages
export interface MessageMiddleware {
  process<TResult>(
    message: Message,
    next: () => Promise<TResult>
  ): Promise<TResult>;
}

// Message bus interface
export interface MessageBus {
  send<TResult>(message: Message): Promise<TResult>;
  registerHandler<TMessage extends Message, TResult>(
    messageType: string,
    handler: (message: TMessage) => Promise<TResult>
  ): void;
  use(middleware: MessageMiddleware): void;
}

// Model definitions
export interface NoteModel {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  fontSize: number;
  autoSave: boolean;
} 