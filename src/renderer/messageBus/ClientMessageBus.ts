import { Message, MessageBus, MessageMiddleware } from '../../shared/models/types';

declare global {
  interface Window {
    electron: {
      messageBus: {
        send: (channel: string, message: Message) => Promise<any>;
        on: (channel: string, callback: (response: any) => void) => () => void;
      };
      isDev: boolean;
    };
  }
}

export class ClientMessageBus implements MessageBus {
  private middlewares: MessageMiddleware[] = [];
  private isConnected = false;
  private useHttpApi = false;
  private apiUrl = 'http://localhost:3002/api/message';

  constructor() {
    this.isConnected = typeof window !== 'undefined' && !!window.electron;
    this.useHttpApi = typeof window !== 'undefined' && window.electron?.isDev;
    
    console.log('[ClientMessageBus] Initialized:');
    console.log(`[ClientMessageBus] - isConnected: ${this.isConnected}`);
    console.log(`[ClientMessageBus] - useHttpApi: ${this.useHttpApi}`);
    console.log(`[ClientMessageBus] - apiUrl: ${this.apiUrl}`);
    console.log(`[ClientMessageBus] - window.electron.isDev: ${typeof window !== 'undefined' ? window.electron?.isDev : 'undefined'}`);
  }

  registerHandler<TMessage extends Message, TResult>(
    messageType: string,
    handler: (message: TMessage) => Promise<TResult>
  ): void {
    // Client message bus doesn't handle messages, it only sends them
    console.warn('Client message bus does not support registering handlers');
  }

  use(middleware: MessageMiddleware): void {
    this.middlewares.push(middleware);
  }

  async send<TResult>(message: Message): Promise<TResult> {
    // Apply middlewares
    let processedMessage = message;
    
    if (this.middlewares.length > 0) {
      // Create a chain of middleware calls
      let index = 0;
      const next = async (currentMessage: Message): Promise<Message> => {
        if (index < this.middlewares.length) {
          const middleware = this.middlewares[index++];
          return await middleware.process(currentMessage, 
            () => next(currentMessage)) as unknown as Message;
        } else {
          return currentMessage;
        }
      };
      
      processedMessage = await next(message) as Message;
    }
    
    // Log the transport method
    console.log(`[ClientMessageBus] Sending message via ${this.useHttpApi ? 'HTTP API' : this.isConnected ? 'IPC' : 'unknown transport'}`);
    
    // Send the message
    let response: TResult;
    
    if (this.useHttpApi) {
      // Use HTTP API in development mode
      try {
        console.log(`[ClientMessageBus] Sending to ${this.apiUrl}:`, JSON.stringify(processedMessage, null, 2));
        
        const result = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(processedMessage),
        });
        
        if (!result.ok) {
          console.error(`[ClientMessageBus] HTTP error: ${result.status} ${result.statusText}`);
          
          // Try to parse error message, but handle case where response isn't valid JSON
          try {
            const errorData = await result.json();
            throw new Error(errorData.error || `Server error: ${result.status}`);
          } catch (jsonError) {
            throw new Error(`Server error: ${result.status} - ${result.statusText}`);
          }
        }
        
        // Handle case where response isn't valid JSON
        try {
          response = await result.json();
          console.log(`[ClientMessageBus] Response:`, response);
        } catch (jsonError) {
          console.error(`[ClientMessageBus] Error parsing JSON response`, jsonError);
          throw new Error(`Invalid JSON response from server`);
        }
      } catch (error) {
        console.error('Error sending message via HTTP:', error);
        throw error;
      }
    } else if (this.isConnected) {
      // Use IPC in Electron
      try {
        console.log(`[ClientMessageBus] Sending via IPC:`, JSON.stringify(processedMessage, null, 2));
        response = await window.electron.messageBus.send(
          'message', 
          processedMessage
        );
        console.log(`[ClientMessageBus] IPC Response:`, response);
      } catch (error) {
        console.error('Error sending message via IPC:', error);
        throw error;
      }
    } else {
      throw new Error('No message transport available');
    }
    
    return response;
  }
} 