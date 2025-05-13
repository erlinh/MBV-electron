import { Message, MessageBus, MessageMiddleware } from '../../shared/models/types';
export declare class ElectronMessageBus implements MessageBus {
    private handlers;
    private middlewares;
    registerHandler<TMessage extends Message, TResult>(messageType: string, handler: (message: TMessage) => Promise<TResult>): void;
    use(middleware: MessageMiddleware): void;
    send<TResult>(message: Message): Promise<TResult>;
}
