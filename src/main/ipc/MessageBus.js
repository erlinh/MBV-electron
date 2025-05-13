class ElectronMessageBus {
  constructor() {
    this.handlers = new Map();
    this.middlewares = [];
  }

  registerHandler(messageType, handler) {
    this.handlers.set(messageType, handler);
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  async send(message) {
    // Apply middlewares
    let result;
    
    const executeHandler = async () => {
      const handler = this.handlers.get(message.type);
      if (!handler) {
        throw new Error(`No handler registered for message type: ${message.type}`);
      }
      return await handler(message);
    };

    // Chain middlewares
    if (this.middlewares.length > 0) {
      // Create a chain of middleware calls
      let index = 0;
      const next = async () => {
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

module.exports = { ElectronMessageBus }; 