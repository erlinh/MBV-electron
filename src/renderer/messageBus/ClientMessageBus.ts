import { Message, MessageBus, MessageMiddleware } from '../../shared/models/types';
import { logMessage } from '../components/MessageInspector';

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
    // Create a chain of middleware calls that will eventually send the message
    let index = 0;
    const startTime = Date.now();
    
    const executeRequest = async (): Promise<TResult> => {
      // Log the transport method
      console.log(`[ClientMessageBus] Sending message via ${this.useHttpApi ? 'HTTP API' : this.isConnected ? 'IPC' : 'unknown transport'}`);
      
      // Send the message
      let response: TResult;
      
      if (this.useHttpApi) {
        // Use HTTP API in development mode
        try {
          console.log(`[ClientMessageBus] Sending to ${this.apiUrl}:`, JSON.stringify(message, null, 2));
          
          const result = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
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
            
            // Direct logging to message inspector
            const duration = Date.now() - startTime;
            logMessage(message, response, duration);
            
            return response;
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
          console.log(`[ClientMessageBus] Sending via IPC:`, JSON.stringify(message, null, 2));
          response = await window.electron.messageBus.send(
            'message', 
            message
          );
          console.log(`[ClientMessageBus] IPC Response:`, response);
          
          // Direct logging to message inspector
          const duration = Date.now() - startTime;
          logMessage(message, response, duration);
          
          return response;
        } catch (error) {
          console.error('Error sending message via IPC:', error);
          throw error;
        }
      } else {
        throw new Error('No message transport available');
      }
      
      return response;
    };

    const next = async (): Promise<TResult> => {
      if (index < this.middlewares.length) {
        const middleware = this.middlewares[index++];
        return middleware.process(message, next);
      } else {
        return executeRequest();
      }
    };
    
    return next();
  }
} 