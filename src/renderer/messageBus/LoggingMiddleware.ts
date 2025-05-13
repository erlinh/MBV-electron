import { Message, MessageMiddleware } from '../../shared/models/types';
import { logMessage } from '../components/MessageInspector';

export class LoggingMiddleware implements MessageMiddleware {
  async process<TResult>(
    message: Message,
    next: () => Promise<TResult>
  ): Promise<TResult> {
    const startTime = Date.now();
    
    console.log(`[MessageBus] Sending message: ${message.type}`, 
      JSON.stringify(message.payload, null, 2));
    
    try {
      const result = await next();
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.log(`[MessageBus] Message response: ${message.type} in ${duration}ms`);
      
      // Log the message to the inspector
      logMessage(message, result, duration);
      
      return result;
    } catch (error) {
      console.error(`[MessageBus] Error sending message: ${message.type}`, error);
      
      // Log the error to the inspector
      logMessage(message, { error: error instanceof Error ? error.message : 'Unknown error' }, Date.now() - startTime);
      
      throw error;
    }
  }
} 