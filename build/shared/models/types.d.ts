export interface Message {
    type: string;
    payload: unknown;
}
export interface MessageHandler<TMessage extends Message, TResult> {
    handle(message: TMessage): Promise<TResult>;
}
export interface MessageMiddleware {
    process<TResult>(message: Message, next: () => Promise<TResult>): Promise<TResult>;
}
export interface MessageBus {
    send<TResult>(message: Message): Promise<TResult>;
    registerHandler<TMessage extends Message, TResult>(messageType: string, handler: (message: TMessage) => Promise<TResult>): void;
    use(middleware: MessageMiddleware): void;
}
export interface NoteModel {
    id: string;
    title: string;
    content: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}
export interface UserPreferences {
    theme: 'light' | 'dark';
    fontSize: number;
    autoSave: boolean;
}
