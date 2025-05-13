import { Message, MessageBus, MessageMiddleware } from '../../shared/models/types';

describe('Message Interface', () => {
  it('should define a valid message', () => {
    const message: Message = {
      type: 'TestMessage',
      payload: { test: 'data' },
    };
    
    expect(message.type).toBe('TestMessage');
    expect(message.payload).toEqual({ test: 'data' });
  });
});

// Create a mock implementation of MessageBus for testing
class MockMessageBus implements MessageBus {
  private handlers = new Map<string, (message: Message) => Promise<any>>();
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
    const handler = this.handlers.get(message.type);
    if (!handler) {
      throw new Error(`No handler registered for message type: ${message.type}`);
    }
    
    if (this.middlewares.length === 0) {
      return await handler(message) as TResult;
    }
    
    // Apply middlewares
    let index = 0;
    const next = async (): Promise<TResult> => {
      if (index < this.middlewares.length) {
        const middleware = this.middlewares[index++];
        return await middleware.process(message, next);
      } else {
        return await handler(message) as TResult;
      }
    };
    
    return await next();
  }
}

describe('MessageBus and MessageMiddleware', () => {
  it('should register handlers and process messages', async () => {
    const messageBus = new MockMessageBus();
    
    // Register a test handler
    messageBus.registerHandler('TestMessage', async (message) => {
      return { success: true, data: message.payload };
    });
    
    // Create a test message
    const message: Message = {
      type: 'TestMessage',
      payload: { test: 'data' },
    };
    
    // Process the message
    const result = await messageBus.send(message);
    
    // Verify the result
    expect(result).toEqual({ success: true, data: { test: 'data' } });
  });
  
  it('should apply middlewares in the correct order', async () => {
    const messageBus = new MockMessageBus();
    const operations: string[] = [];
    
    // Create middleware 1
    const middleware1: MessageMiddleware = {
      async process(message, next) {
        operations.push('middleware1:before');
        const result = await next();
        operations.push('middleware1:after');
        return result;
      },
    };
    
    // Create middleware 2
    const middleware2: MessageMiddleware = {
      async process(message, next) {
        operations.push('middleware2:before');
        const result = await next();
        operations.push('middleware2:after');
        return result;
      },
    };
    
    // Register middlewares
    messageBus.use(middleware1);
    messageBus.use(middleware2);
    
    // Register a test handler
    messageBus.registerHandler('TestMessage', async (message) => {
      operations.push('handler');
      return { success: true };
    });
    
    // Create a test message
    const message: Message = {
      type: 'TestMessage',
      payload: {},
    };
    
    // Process the message
    await messageBus.send(message);
    
    // Verify the order of operations
    expect(operations).toEqual([
      'middleware1:before',
      'middleware2:before',
      'handler',
      'middleware2:after',
      'middleware1:after',
    ]);
  });
}); 