import { Message, MessageMiddleware } from '../../shared/models/types';

export class LoggingMiddleware implements MessageMiddleware {
  async process<TResult>(
    message: Message,
    next: () => Promise<TResult>
  ): Promise<TResult> {
    const startTime = Date.now();
    
    console.log(`[MessageBus] Processing message: ${message.type}`, 
      JSON.stringify(message.payload, null, 2));
    
    try {
      const result = await next();
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.log(`[MessageBus] Message processed: ${message.type} in ${duration}ms`);
      
      return result;
    } catch (error) {
      console.error(`[MessageBus] Error processing message: ${message.type}`, error);
      throw error;
    }
  }
} 