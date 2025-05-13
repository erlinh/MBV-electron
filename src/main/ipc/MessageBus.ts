import { Message, MessageBus, MessageMiddleware } from '../../shared/models/types';

export class ElectronMessageBus implements MessageBus {
  private handlers: Map<string, (message: Message) => Promise<any>> = new Map();
  private middlewares: MessageMiddleware[] = [];

  registerHandler<TMessage extends Message, TResult>(
    messageType: string,
    handler: (message: TMessage) => Promise<TResult>
  ): void {
    this.handlers.set(messageType, handler as (message: Message) => Promise<any>);
  }

  use(middleware: MessageMiddleware): void {
    this.middlewares.push(middleware);
  }

  async send<TResult>(message: Message): Promise<TResult> {
    // Apply middlewares
    let result: TResult;
    
    const executeHandler = async (): Promise<TResult> => {
      const handler = this.handlers.get(message.type);
      if (!handler) {
        throw new Error(`No handler registered for message type: ${message.type}`);
      }
      return await handler(message) as TResult;
    };

    // Chain middlewares
    if (this.middlewares.length > 0) {
      // Create a chain of middleware calls
      let index = 0;
      const next = async (): Promise<TResult> => {
        if (index < this.middlewares.length) {
          const middleware = this.middlewares[index++];
          return await middleware.process(message, next);
        } else {
          return await executeHandler();
        }
      };
      
      result = await next();
    } else {
      result = await executeHandler();
    }

    return result;
  }
} 