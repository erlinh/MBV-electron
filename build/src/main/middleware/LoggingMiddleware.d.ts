import { Message, MessageMiddleware } from '../../shared/models/types';
export declare class LoggingMiddleware implements MessageMiddleware {
    process<TResult>(message: Message, next: () => Promise<TResult>): Promise<TResult>;
}
