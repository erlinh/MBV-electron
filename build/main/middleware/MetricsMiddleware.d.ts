import { Message, MessageMiddleware } from '../../shared/models/types';
export declare class MetricsMiddleware implements MessageMiddleware {
    private metrics;
    process<TResult>(message: Message, next: () => Promise<TResult>): Promise<TResult>;
    private recordMetrics;
    getMetrics(): {
        messageType: string;
        count: number;
        avgTime: number;
    }[];
}
